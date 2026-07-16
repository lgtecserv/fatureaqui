import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetPassword() {
  const newPassword = 'password123';
  
  console.log(`Buscando utilizadores...`);
  
  // Get users
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error("Erro ao listar utilizadores:", usersError);
    return;
  }
  
  const users = usersData.users;
  
  if (users.length === 0) {
    console.error(`Nenhum utilizador encontrado na base de dados.`);
    return;
  }
  
  for (const user of users) {
    console.log(`A redefinir senha para: ${user.email} (ID: ${user.id})`);
    
    const { error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );
    
    if (error) {
      console.error("Erro ao atualizar senha para", user.email, ":", error.message);
    } else {
      console.log(`✅ Senha atualizada com sucesso para ${user.email}! Nova Senha: ${newPassword}`);
    }
  }
}

resetPassword();
