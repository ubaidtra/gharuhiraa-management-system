import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

async function createAdminUser() {
  console.log("Creating admin user...");
  
  const username = "admin";
  const password = "admin123456";
  const role = "MANAGEMENT";
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data: existingUser, error: checkError } = await supabase
      .from("User")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking user:", checkError);
      return;
    }
    
    if (existingUser) {
      const { error: updateError } = await supabase
        .from("User")
        .update({ 
          password: hashedPassword,
          role: role
        })
        .eq("id", existingUser.id);
      
      if (updateError) {
        console.error("Error updating user:", updateError);
        return;
      }
      
      console.log(`✅ Updated admin user: ${username}`);
    } else {
      const { error: insertError } = await supabase
        .from("User")
        .insert({
          username: username,
          password: hashedPassword,
          role: role,
        });
      
      if (insertError) {
        console.error("Error creating user:", insertError);
        return;
      }
      
      console.log(`✅ Created admin user: ${username}`);
    }
    
    const { data: verifyUser, error: verifyError } = await supabase
      .from("User")
      .select("*")
      .eq("username", username)
      .single();
    
    if (verifyUser && !verifyError) {
      const passwordMatch = await bcrypt.compare(password, verifyUser.password);
      console.log(`Password verification: ${passwordMatch ? "✅ Match" : "❌ No match"}`);
      console.log(`User role: ${verifyUser.role}`);
    }
    
    console.log("🎉 Admin user setup completed!");
  } catch (error) {
    console.error("Error:", error);
  }
}

createAdminUser()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  });

