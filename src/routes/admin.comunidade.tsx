import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { 
  MessageSquare, Heart, Image as ImageIcon, Send, 
  Loader2, Building2, Trash2, X, User
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

export const Route = createFileRoute("/admin/comunidade")({
  component: AdminComunidadePage,
});

function AdminComunidadePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // States for new post
  const [newPost, setNewPost] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Fetch all posts (admin view)
  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select(`
          *,
          companies (id, name, logo_url),
          community_likes (id, user_id),
          community_comments (
            id, content, created_at, user_id, company_id,
            companies (id, name, logo_url)
          )
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data;
    },
  });

  const createPost = useMutation({
    mutationFn: async () => {
      let imageUrls: string[] | null = null;
      
      if (imageFiles.length > 0) {
        imageUrls = [];
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `official/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from("community_images")
            .upload(filePath, file);
            
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage.from("community_images").getPublicUrl(filePath);
          imageUrls.push(data.publicUrl);
        }
      }

      // NO company_id -> OFFICIAL POST
      const { error } = await supabase.from("community_posts").insert({
        user_id: user?.id,
        content: newPost,
        image_urls: imageUrls,
        company_id: null
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setNewPost("");
      setImageFiles([]);
      setImagePreviews([]);
      toast.success("Publicação oficial criada!");
      queryClient.invalidateQueries({ queryKey: ["admin-community-posts"] });
    },
    onError: () => toast.error("Erro ao criar publicação"),
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from("community_posts").delete().eq("id", postId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Postagem excluída");
      queryClient.invalidateQueries({ queryKey: ["admin-community-posts"] });
    }
  });
  
  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from("community_comments").delete().eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Comentário excluído");
      queryClient.invalidateQueries({ queryKey: ["admin-community-posts"] });
    }
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (imageFiles.length + files.length > 4) {
        toast.error("Máximo de 4 imagens por publicação");
        return;
      }
      
      setImageFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newPreviews).then(urls => {
        setImagePreviews(prev => [...prev, ...urls]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestão da Comunidade</h1>
        <p className="text-muted-foreground">Publique em nome do FatureAqui e modere o conteúdo.</p>
      </div>

      {/* CREATE POST CARD (OFFICIAL) */}
      <div className="bg-card border border-primary/20 rounded-2xl p-6 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
          Publicação Oficial
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border flex items-center justify-center shrink-0">
            <img src="/logo.png" className="w-full h-full object-contain p-1" />
          </div>
          <div className="flex-1">
            <textarea 
              placeholder="Escreva um comunicado ou novidade para a comunidade..."
              className="w-full bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground min-h-[60px]"
              value={newPost}
              onChange={(e) => {
                setNewPost(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
            
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {imagePreviews.map((url, i) => (
                  <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-border">
                    <img src={url} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  id="admin-image-upload" 
                  onChange={handleImageSelect}
                />
                <label 
                  htmlFor="admin-image-upload" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer transition px-3 py-1.5 rounded-md hover:bg-primary/10"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="font-medium">Anexar imagens</span>
                </label>
              </div>
              <button 
                disabled={(!newPost.trim() && imageFiles.length === 0) || createPost.isPending}
                onClick={() => createPost.mutate()}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 shadow-md shadow-primary/20"
              >
                {createPost.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Publicar Comunicado
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FEED LIST */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : posts?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-dashed rounded-2xl">
            Nenhuma publicação encontrada na comunidade.
          </div>
        ) : (
          posts?.map((post: any) => (
            <FeedPost key={post.id} post={post} user={user} deletePost={deletePost} deleteComment={deleteComment} />
          ))
        )}
      </div>
    </div>
  );
}

function PostModal({ post, currentUser, onClose, deleteComment }: { post: any, currentUser: any, onClose: () => void, deleteComment: any }) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<any>(null);

  const { data: comments } = useQuery({
    queryKey: ["admin-comments", post.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("community_comments")
        .select("*, companies(name, logo_url)")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });
      return data;
    },
  });

  const submitComment = useMutation({
    mutationFn: async () => {
      const payload: any = {
        post_id: post.id,
        user_id: currentUser.id,
        content: comment.trim(),
        company_id: null, // Admin is always null
        parent_id: replyingTo ? replyingTo.id : null
      };
      await supabase.from("community_comments").insert(payload);
    },
    onSuccess: () => {
      setComment("");
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ["admin-comments", post.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-community-posts"] });
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
            <h3 className="font-bold text-lg">Comentários (Admin)</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {topLevelComments.length === 0 && <p className="text-center text-muted-foreground text-sm mt-10">Nenhum comentário ainda.</p>}
            
            {topLevelComments.map(c => (
              <div key={c.id} className="space-y-3">
                <div className="flex gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 shrink-0 overflow-hidden border">
                    {c.company_id === null ? <img src="/logo.png" className="w-full h-full object-contain p-1" /> : (c.companies?.logo_url ? <img src={c.companies.logo_url} className="w-full h-full object-cover" /> : <Building2 className="w-4 h-4 m-2 text-primary" />)}
                  </div>
                  <div className="flex-1 flex flex-col items-start relative">
                    <div className="bg-black/5 dark:bg-white/10 px-4 py-2 rounded-2xl rounded-tl-none text-sm inline-block max-w-[95%] text-left">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="font-bold text-foreground flex items-center gap-2">
                          {c.company_id === null ? "Equipa FatureAqui" : c.companies?.name}
                          {c.company_id === null && <span className="bg-primary text-white text-[9px] px-1 py-0.5 rounded uppercase tracking-wider">Oficial</span>}
                        </span>
                        <button 
                          onClick={() => { if (confirm("Excluir comentário?")) deleteComment.mutate(c.id) }}
                          className="text-destructive/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition absolute -right-6 top-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                      <div key={reply.id} className="flex gap-3 group">
                        <div className="w-6 h-6 rounded-full bg-primary/10 shrink-0 overflow-hidden border">
                          {reply.company_id === null ? <img src="/logo.png" className="w-full h-full object-contain p-1" /> : (reply.companies?.logo_url ? <img src={reply.companies.logo_url} className="w-full h-full object-cover" /> : <Building2 className="w-3 h-3 m-1.5 text-primary" />)}
                        </div>
                        <div className="flex-1 flex flex-col items-start relative">
                          <div className="bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-2xl rounded-tl-none text-xs inline-block max-w-[95%] text-left">
                            <div className="flex justify-between items-start mb-0.5">
                              <span className="font-bold text-foreground flex items-center gap-2">
                                {reply.company_id === null ? "Equipa FatureAqui" : reply.companies?.name}
                              </span>
                              <button 
                                onClick={() => { if (confirm("Excluir comentário?")) deleteComment.mutate(reply.id) }}
                                className="text-destructive/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition absolute -right-6 top-1.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
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
                placeholder={replyingTo ? "Escreva uma resposta oficial..." : "Escreva um comentário oficial..."}
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

function FeedPost({ post, user, deletePost, deleteComment }: { post: any, user: any, deletePost: any, deleteComment: any }) {
  const [showComments, setShowComments] = useState(false);
  return (
    <div className={`bg-card border rounded-2xl overflow-hidden shadow-soft ${post.company_id === null ? 'border-primary/30 shadow-primary/5' : 'border-border'}`}>
      
      {/* POST HEADER */}
      <div className="p-5 flex items-start justify-between">
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
        <button 
          onClick={() => { if (confirm("Excluir esta publicação?")) deletePost.mutate(post.id) }}
          className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition"
          title="Deletar publicação"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* POST CONTENT */}
      <div className="px-5 pb-4 text-sm text-foreground whitespace-pre-wrap">
        {post.content}
      </div>

      {/* POST IMAGES */}
      {post.image_urls && post.image_urls.length > 0 && (
        <div className={`grid gap-1 px-5 pb-4 bg-muted/20 ${post.image_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.image_urls.map((url: string, i: number) => (
            <img key={i} src={url} alt="Anexo" className="w-full h-[350px] object-contain rounded-lg border border-border" />
          ))}
        </div>
      )}

      {/* POST STATS */}
      <div className="px-5 py-3 border-t border-border flex items-center gap-6 text-muted-foreground text-sm">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4" /> {post.community_likes?.length || 0}
        </div>
        <button onClick={() => setShowComments(true)} className="flex items-center gap-2 hover:text-foreground transition">
          <MessageSquare className="w-4 h-4" /> {post.community_comments?.length || 0}
        </button>
      </div>

      {showComments && <PostModal post={post} currentUser={user} onClose={() => setShowComments(false)} deleteComment={deleteComment} />}
    </div>
  );
}
