import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { useAuth } from "@/hooks/use-auth";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { 
  MessageSquare, Heart, Image as ImageIcon, Send, 
  Loader2, MoreHorizontal, User, Building2, Check, CheckCheck, Search, X, Sparkles, Key
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { pt } from "date-fns/locale";

export const Route = createFileRoute("/painel/comunidade")({
  component: ComunidadePage,
});

function ComunidadePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"feed" | "chats">("feed");
  const [initialChat, setInitialChat] = useState<any>(null);

  const openChat = (chatData: any) => {
    setInitialChat(chatData);
    setActiveTab("chats");
  };

  return (
    <>
      <Topbar
        title="Comunidade"
        subtitle="Networking, serviços e troca de experiências"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                activeTab === "feed" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab("chats")}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                activeTab === "chats" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Mensagens
            </button>
          </div>
        }
      />
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 space-y-6 pb-24">
        {activeTab === "feed" ? <FeedView user={user} onOpenChat={openChat} /> : <ChatsView user={user} initialChat={initialChat} setInitialChat={setInitialChat} />}
      </div>
    </>
  );
}

function FeedView({ user, onOpenChat }: { user: any, onOpenChat?: (chat: any) => void }) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-post", {
        body: { prompt: aiPrompt }
      });
      
      if (error) throw error;
      
      setContent(data.content);
      setAiModalOpen(false);
      setAiPrompt("");
      toast.success("Publicação gerada com sucesso!");
    } catch (err: any) {
      toast.error("Falha ao gerar texto: Verifique se a Edge Function está online");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    setImageFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreviews(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const { data: posts, isLoading } = useQuery({
    queryKey: ["community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select(`
          *,
          companies (id, name, logo_url),
          community_likes (user_id),
          community_comments (count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: userCompany } = useQuery({
    queryKey: ["my-company", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("companies")
        .select("id, name")
        .eq("user_id", user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const createPost = useMutation({
    mutationFn: async () => {
      if (!userCompany) throw new Error("Empresa não encontrada");
      
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from("community_images")
            .upload(filePath, file);
            
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage.from("community_images").getPublicUrl(filePath);
          imageUrls.push(data.publicUrl);
        }
      }

      const { error } = await supabase.from("community_posts").insert({
        user_id: user.id,
        company_id: userCompany.id,
        content,
        image_urls: imageUrls
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setContent("");
      setImageFiles([]);
      setImagePreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("Publicado com sucesso!");
    },
    onError: (e: any) => {
      toast.error("Erro ao publicar: " + e.message);
    }
  });

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              placeholder="Divulgue seus serviços, peça indicações ou faça networking..."
              className="w-full min-h-[80px] bg-transparent resize-none outline-none text-sm placeholder:text-muted-foreground"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((previewUrl, i) => (
                  <div key={i} className="relative inline-block">
                    <img src={previewUrl} alt="Preview" className="h-24 w-24 rounded-lg object-cover bg-muted" />
                    <button 
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <input 
                type="file" 
                multiple
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageSelect}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-sm font-semibold transition"
              >
                <ImageIcon className="w-4 h-4" /> Anexar Panfleto
              </button>
              <button 
                onClick={() => setAiModalOpen(true)}
                className="text-primary hover:text-primary/80 flex items-center gap-1.5 text-sm font-bold transition ml-4 mr-auto"
              >
                <Sparkles className="w-4 h-4" /> Gerar com IA
              </button>
              <button 
                onClick={() => createPost.mutate()}
                disabled={(!content.trim() && imageFiles.length === 0) || createPost.isPending}
                className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {createPost.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Post Generator Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Gerador de Publicações IA</h3>
            <p className="text-sm text-muted-foreground mb-4">Diga o que você quer anunciar e nossa IA escreve um texto de marketing irresistível para você publicar.</p>
            
            <textarea 
              placeholder="Ex: Quero oferecer serviços de consultoria contábil para pequenas empresas. Destaque que nossa primeira consulta é grátis."
              className="w-full bg-muted/30 border border-border rounded-xl p-4 text-sm min-h-[120px] focus:outline-none focus:border-primary mb-4 resize-none"
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
            />
            
            <div className="flex justify-end items-center">
              <div className="flex gap-2">
                <button onClick={() => setAiModalOpen(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
                <button 
                  onClick={handleGenerateAI} 
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Gerar Texto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feed */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : posts?.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground border border-dashed rounded-2xl">
          Nenhuma publicação ainda. Seja o primeiro a divulgar!
        </div>
      ) : (
        <div className="space-y-4">
          {posts?.map(post => <PostCard key={post.id} post={post} currentUser={user} onOpenChat={onOpenChat} />)}
        </div>
      )}
    </div>
  );
}

function PostModal({ post, currentUser, onClose }: { post: any, currentUser: any, onClose: () => void }) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<any>(null);

  const { data: comments } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("community_comments")
        .select("*, companies(name, logo_url)")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });
      return data;
    },
  });

  const { data: userCompany } = useQuery({
    queryKey: ["my-company", currentUser?.id],
    queryFn: async () => {
      const { data } = await supabase.from("companies").select("id").eq("user_id", currentUser.id).single();
      return data;
    },
    enabled: !!currentUser,
  });

  const submitComment = useMutation({
    mutationFn: async () => {
      const payload: any = {
        post_id: post.id,
        user_id: currentUser.id,
        content: comment.trim(),
        company_id: userCompany ? userCompany.id : null,
        parent_id: replyingTo ? replyingTo.id : null
      };
      await supabase.from("community_comments").insert(payload);
    },
    onSuccess: () => {
      setComment("");
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    }
  });

  const topLevelComments = comments?.filter(c => !c.parent_id) || [];
  const getReplies = (parentId: string) => comments?.filter(c => c.parent_id === parentId) || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl" onClick={e => e.stopPropagation()}>
        
        {/* Left Side (Post details) */}
        <div className="w-full md:w-[60%] overflow-y-auto bg-muted/10 border-b md:border-b-0 md:border-r border-border p-6 hidden md:flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center overflow-hidden border">
              {post.company_id === null ? (
                <img src="/logo.png" className="w-full h-full object-contain p-1" />
              ) : post.companies?.logo_url ? (
                <img src={post.companies.logo_url} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-foreground flex items-center gap-2">
                {post.company_id === null ? "Equipa FatureAqui" : (post.companies?.name || "Empresa")}
                {post.company_id === null && <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Oficial</span>}
              </h4>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: pt })}
              </span>
            </div>
          </div>
          
          <div className="text-foreground whitespace-pre-wrap leading-relaxed mb-6 text-sm">
            {post.content}
          </div>

          <div className="space-y-2">
             {post.image_urls?.map((url: string, i: number) => (
                <img key={i} src={url} alt="Anexo" className="w-full rounded-xl object-contain bg-muted/30 max-h-[400px]" />
             ))}
             {post.image_url && (!post.image_urls || post.image_urls.length === 0) && (
                <img src={post.image_url} alt="Anexo" className="w-full rounded-xl object-contain bg-muted/30 max-h-[400px]" />
             )}
          </div>
        </div>

        {/* Right Side (Comments) */}
        <div className="w-full md:w-[40%] flex flex-col h-full bg-card max-h-[90vh]">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-lg">Comentários</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {topLevelComments.length === 0 && <p className="text-center text-muted-foreground text-sm mt-10">Nenhum comentário ainda. Seja o primeiro!</p>}
            
            {topLevelComments.map(c => (
              <div key={c.id} className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 shrink-0 overflow-hidden border">
                    {c.company_id === null ? <img src="/logo.png" className="w-full h-full object-contain p-1" /> : (c.companies?.logo_url ? <img src={c.companies.logo_url} className="w-full h-full object-cover" /> : <Building2 className="w-4 h-4 m-2 text-primary" />)}
                  </div>
                  <div className="flex-1 flex flex-col items-start">
                    <div className="bg-black/5 dark:bg-white/10 px-4 py-2 rounded-2xl rounded-tl-none text-sm inline-block max-w-[95%] text-left">
                      <span className="font-bold text-foreground block mb-0.5 flex items-center gap-2">
                        {c.company_id === null ? "Equipa FatureAqui" : c.companies?.name}
                        {c.company_id === null && <span className="bg-primary text-white text-[9px] px-1 py-0.5 rounded uppercase tracking-wider">Oficial</span>}
                      </span>
                      <span className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{c.content}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-muted-foreground font-semibold">
                      <button onClick={() => setReplyingTo(c)} className="hover:text-foreground transition">Responder</button>
                    </div>
                  </div>
                </div>

                {getReplies(c.id).length > 0 && (
                  <div className="ml-11 space-y-3 mt-2">
                    {getReplies(c.id).map(reply => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 shrink-0 overflow-hidden border">
                          {reply.company_id === null ? <img src="/logo.png" className="w-full h-full object-contain p-1" /> : (reply.companies?.logo_url ? <img src={reply.companies.logo_url} className="w-full h-full object-cover" /> : <Building2 className="w-3 h-3 m-1.5 text-primary" />)}
                        </div>
                        <div className="flex-1 flex flex-col items-start">
                          <div className="bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-2xl rounded-tl-none text-xs inline-block max-w-[95%] text-left">
                            <span className="font-bold text-foreground block mb-0.5 flex items-center gap-2">
                              {reply.company_id === null ? "Equipa FatureAqui" : reply.companies?.name}
                            </span>
                            <span className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{reply.content}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border bg-card">
            {replyingTo && (
              <div className="flex items-center justify-between text-xs bg-muted/50 px-3 py-2 rounded-lg mb-3">
                <span className="text-muted-foreground">Respondendo a <span className="font-bold text-foreground">{replyingTo.company_id === null ? "Equipa FatureAqui" : replyingTo.companies?.name}</span></span>
                <button onClick={() => setReplyingTo(null)} className="text-foreground/50 hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
              </div>
            )}
            <div className="flex gap-3 relative">
              <input 
                type="text"
                placeholder={replyingTo ? "Escreva uma resposta..." : "Escreva um comentário..."}
                className="w-full bg-muted/30 border rounded-full px-4 py-2 text-sm pr-12 focus:outline-none focus:border-primary"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && comment.trim()) submitComment.mutate();
                }}
              />
              <button 
                disabled={!comment.trim() || submitComment.isPending}
                onClick={() => submitComment.mutate()}
                className="absolute right-2 top-1.5 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50"
              >
                {submitComment.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3 ml-0.5" />}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function PostCard({ post, currentUser, onOpenChat }: { post: any, currentUser: any, onOpenChat?: (chat: any) => void }) {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);

  const isLiked = post.community_likes?.some((l: any) => l.user_id === currentUser?.id);

  const toggleLike = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        await supabase.from("community_likes").delete().match({ post_id: post.id, user_id: currentUser?.id });
      } else {
        await supabase.from("community_likes").insert({ post_id: post.id, user_id: currentUser?.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    }
  });

  const startChat = async () => {
    if (post.user_id === currentUser.id) return;
    
    // Check if chat exists
    const { data: existingChat } = await supabase
      .from("community_chats")
      .select("*")
      .or(`and(participant1_id.eq.${currentUser.id},participant2_id.eq.${post.user_id}),and(participant1_id.eq.${post.user_id},participant2_id.eq.${currentUser.id})`)
      .single();

    let finalChat = existingChat;

    if (!existingChat) {
      const { data: newChat, error } = await supabase.from("community_chats").insert({
        participant1_id: currentUser.id,
        participant2_id: post.user_id
      }).select().single();
      
      if (error) {
        toast.error("Erro ao iniciar chat");
        return;
      }
      finalChat = newChat;
    }

    if (finalChat && onOpenChat) {
      const chatWithCompany = {
        ...finalChat,
        company1: null,
        company2: post.companies
      };
      onOpenChat(chatWithCompany);
    } else {
      toast.success("Chat iniciado! Acesse a aba Mensagens.");
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/5 border flex items-center justify-center overflow-hidden">
              {post.company_id === null ? (
                <img src="/logo.png" className="w-full h-full object-contain p-1" />
              ) : post.companies?.logo_url ? (
                <img src={post.companies.logo_url} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                {post.company_id === null ? "Equipa FatureAqui" : (post.companies?.name || "Empresa")}
                {post.company_id === null && <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Oficial</span>}
              </h4>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: pt })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.user_id !== currentUser?.id && post.company_id !== null && (
              <button 
                onClick={startChat}
                className="text-xs bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary px-2.5 py-1 rounded-md font-semibold transition"
              >
                Mensagem
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      {post.image_urls && post.image_urls.length > 0 && (
        <div className={`grid gap-1 bg-muted/20 border-y border-border ${post.image_urls.length === 1 ? 'grid-cols-1' : post.image_urls.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
          {post.image_urls.map((url: string, i: number) => (
            <img key={i} src={url} alt="Panfleto" className="w-full h-[350px] object-contain" />
          ))}
        </div>
      )}
      {post.image_url && (!post.image_urls || post.image_urls.length === 0) && (
        <div className="w-full bg-muted/20 border-y border-border">
          <img src={post.image_url} alt="Panfleto" className="w-full h-[350px] object-contain" />
        </div>
      )}

      <div className="px-5 py-3 border-t border-border flex items-center gap-6">
        <button 
          onClick={() => toggleLike.mutate()}
          className={`flex items-center gap-1.5 text-sm font-semibold transition ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          {post.community_likes?.length || 0}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <MessageSquare className="w-4 h-4" />
          {post.community_comments?.[0]?.count || 0}
        </button>
      </div>

      {showComments && <PostModal post={post} currentUser={currentUser} onClose={() => setShowComments(false)} />}
    </div>
  );
}

function ChatsView({ user, initialChat, setInitialChat }: { user: any; initialChat?: any; setInitialChat?: any }) {
  const [activeChat, setActiveChat] = useState<any>(initialChat || null);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialChat) {
      setActiveChat(initialChat);
      if (setInitialChat) setInitialChat(null);
    }
  }, [initialChat, setInitialChat]);

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingLoading, setIsSearchingLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const searchCompanies = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearchingLoading(true);
    const { data } = await supabase
      .from("companies")
      .select("id, name, logo_url, user_id")
      .ilike("name", `%${query}%`)
      .neq("user_id", user.id)
      .limit(10);
      
    setSearchResults(data || []);
    setIsSearchingLoading(false);
  };

  const startNewChat = async (company: any) => {
    const { data: existingChat } = await supabase
      .from("community_chats")
      .select("*")
      .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${company.user_id}),and(participant1_id.eq.${company.user_id},participant2_id.eq.${user.id})`)
      .single();

    if (existingChat) {
      const chatsList: any[] = queryClient.getQueryData(["community-chats"]) || [];
      const c = chatsList.find((ch: any) => ch.id === existingChat.id);
      if (c) setActiveChat(c);
      else setActiveChat({...existingChat, company1: null, company2: company});
    } else {
      const { data: newChat, error } = await supabase.from("community_chats").insert({
        participant1_id: user.id,
        participant2_id: company.user_id
      }).select().single();
      
      if (!error && newChat) {
        queryClient.invalidateQueries({ queryKey: ["community-chats"] });
        toast.success("Chat iniciado!");
        setTimeout(() => setActiveChat({...newChat, company1: null, company2: company}), 500); 
      } else {
        toast.error("Erro ao criar chat");
      }
    }
    setIsSearching(false);
    setSearchQuery("");
  };

  const { data: chats } = useQuery({
    queryKey: ["community-chats"],
    queryFn: async () => {
      const { data: userChats } = await supabase
        .from("community_chats")
        .select("*")
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`);
        
      if (!userChats?.length) return [];

      const participantIds = [...new Set(userChats.flatMap(c => [c.participant1_id, c.participant2_id]))];

      const { data: companies } = await supabase
        .from("companies")
        .select("user_id, name, logo_url")
        .in("user_id", participantIds);

      return userChats.map(c => ({
        ...c,
        company1: companies?.find(comp => comp.user_id === c.participant1_id),
        company2: companies?.find(comp => comp.user_id === c.participant2_id)
      }));
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["chat-messages", activeChat?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("community_messages")
        .select("*")
        .eq("chat_id", activeChat.id)
        .order("created_at", { ascending: true });
        
      if (data) {
        const unreadIds = data.filter(m => m.sender_id !== user.id && !m.read_at).map(m => m.id);
        if (unreadIds.length > 0) {
          await supabase
            .from("community_messages")
            .update({ read_at: new Date().toISOString() })
            .in('id', unreadIds);
            
          data.forEach(m => {
            if (unreadIds.includes(m.id)) m.read_at = new Date().toISOString();
          });
        }
      }
      return data;
    },
    enabled: !!activeChat
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!activeChat) return;

    const channel = supabase
      .channel(`chat_${activeChat.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_messages',
          filter: `chat_id=eq.${activeChat.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["chat-messages", activeChat.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChat, queryClient]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `chat/${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from("community_images")
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from("community_images").getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      const { error } = await supabase.from("community_messages").insert({
        chat_id: activeChat.id,
        sender_id: user.id,
        content: message,
        image_url: imageUrl
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setMessage("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  });

  if (!chats?.length && !isSearching) {
    return <div className="text-center p-12 flex flex-col items-center text-muted-foreground border border-dashed rounded-2xl">
      Você ainda não tem conversas. 
      <button onClick={() => setIsSearching(true)} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition">
         Pesquisar e iniciar uma conversa
      </button>
    </div>;
  }

  return (
    <div className="bg-card border border-border rounded-2xl flex h-[600px] overflow-hidden shadow-soft">
      <div className="w-1/3 border-r border-border overflow-y-auto flex flex-col">
        <div className="p-4 border-b border-border font-bold sticky top-0 bg-card z-10 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center">
             <span>Conversas</span>
             <button onClick={() => setIsSearching(!isSearching)} className="text-muted-foreground hover:text-primary hover:bg-primary/10 p-1.5 rounded-full transition">
               <Search className="w-4 h-4" />
             </button>
          </div>
          {isSearching && (
             <div className="relative animate-in fade-in slide-in-from-top-2">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Buscar empresa pelo nome..." 
                  value={searchQuery}
                  onChange={(e) => searchCompanies(e.target.value)}
                  className="w-full bg-muted border-none rounded-full px-4 py-1.5 text-sm outline-none focus:ring-2 ring-primary/20"
                />
             </div>
          )}
        </div>
        
        {isSearching && searchQuery.trim().length >= 2 ? (
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {isSearchingLoading && <div className="text-center p-4"><Loader2 className="w-4 h-4 animate-spin mx-auto text-muted-foreground" /></div>}
             {!isSearchingLoading && searchResults.length === 0 && <div className="text-xs text-center p-4 text-muted-foreground">Nenhuma empresa encontrada.</div>}
             {searchResults.map(company => (
                <button key={company.id} onClick={() => startNewChat(company)} className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-lg text-left transition">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border">
                    {company.logo_url ? <img src={company.logo_url} className="w-full h-full object-cover"/> : <Building2 className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="font-semibold text-sm truncate flex-1">{company.name}</div>
                </button>
             ))}
          </div>
        ) : (
          chats?.map((c: any) => {
            const otherCompany = c.participant1_id === user.id ? c.company2 : c.company1;
            return (
              <button
                key={c.id}
                onClick={() => setActiveChat(c)}
                className={`w-full text-left p-4 flex items-center gap-3 border-b border-border hover:bg-muted/50 transition ${activeChat?.id === c.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 border flex items-center justify-center shrink-0 overflow-hidden">
                  {otherCompany?.logo_url ? (
                    <img src={otherCompany.logo_url} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-bold text-sm truncate">{otherCompany?.name || "Empresa"}</div>
                  <div className="text-xs text-muted-foreground truncate">Clique para ver mensagens...</div>
                </div>
              </button>
            )
          })
        )}
      </div>
      <div className="flex-1 flex flex-col bg-muted/10 relative">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-border bg-card flex items-center gap-3 shadow-sm z-10">
               {(() => {
                 const otherCompany = activeChat.participant1_id === user.id ? activeChat.company2 : activeChat.company1;
                 return (
                   <>
                     <div className="w-10 h-10 rounded-full bg-primary/10 border flex items-center justify-center shrink-0 overflow-hidden">
                       {otherCompany?.logo_url ? <img src={otherCompany.logo_url} className="w-full h-full object-cover" /> : <Building2 className="w-5 h-5 text-primary" />}
                     </div>
                     <span className="font-bold text-sm">{otherCompany?.name || "Empresa"}</span>
                   </>
                 )
               })()}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map((m: any, i: number, arr: any[]) => {
                const isMe = m.sender_id === user.id;
                const showTime = i === 0 || new Date(m.created_at).getTime() - new Date(arr[i-1].created_at).getTime() > 5 * 60 * 1000;
                
                return (
                  <div key={m.id} className="flex flex-col">
                    {showTime && (
                      <div className="text-[10px] text-muted-foreground text-center my-2 uppercase font-semibold">
                        {format(new Date(m.created_at), "dd 'de' MMM, HH:mm", { locale: pt })}
                      </div>
                    )}
                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm flex flex-col gap-1 ${isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card border rounded-tl-none'}`}>
                        {m.image_url && (
                          <img src={m.image_url} alt="Anexo" className="w-full rounded-lg mb-1 object-contain max-h-[300px]" />
                        )}
                        {m.content && <span>{m.content}</span>}
                        <div className={`text-[10px] flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {format(new Date(m.created_at), "HH:mm")}
                          {isMe && (
                            m.read_at ? <CheckCheck className="w-3.5 h-3.5 text-blue-300" /> : <Check className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {imageFile && (
              <div className="absolute bottom-20 left-4 bg-card border rounded-lg p-2 shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-16 h-16 object-cover rounded" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium truncate w-32">{imageFile.name}</span>
                  <button onClick={() => setImageFile(null)} className="text-xs text-destructive text-left hover:underline">Remover anexo</button>
                </div>
              </div>
            )}

            <div className="p-4 bg-card border-t border-border flex gap-2 items-end shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.1)]">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                }}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 bg-muted text-muted-foreground hover:text-primary rounded-full flex items-center justify-center shrink-0 transition"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <textarea 
                placeholder="Escreva sua mensagem..."
                className="flex-1 bg-muted rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-primary/20 resize-none min-h-[44px] max-h-[120px]"
                value={message}
                rows={1}
                onChange={(e) => {
                  setMessage(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (message.trim() || imageFile) sendMessage.mutate();
                  }
                }}
              />
              <button 
                onClick={() => sendMessage.mutate()}
                disabled={(!message.trim() && !imageFile) || sendMessage.isPending}
                className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 disabled:opacity-50 hover:opacity-90 shadow-md transition"
              >
                {sendMessage.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="font-medium text-foreground">Suas Mensagens</p>
            <p className="text-sm">Selecione uma conversa ao lado para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}
