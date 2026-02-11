import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const username = "admin";
    const password = "admin123456";
    const role = "MANAGEMENT";
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data: existingUser, error: checkError } = await supabase
      .from("User")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: "Error checking user: " + checkError.message },
        { status: 500 }
      );
    }
    
    let result;
    if (existingUser) {
      const { error: updateError } = await supabase
        .from("User")
        .update({ 
          password: hashedPassword,
          role: role
        })
        .eq("id", existingUser.id);
      
      if (updateError) {
        return NextResponse.json(
          { error: "Error updating user: " + updateError.message },
          { status: 500 }
        );
      }
      
      result = `Updated admin user: ${username}`;
    } else {
      const { error: insertError } = await supabase
        .from("User")
        .insert({
          username: username,
          password: hashedPassword,
          role: role,
        });
      
      if (insertError) {
        return NextResponse.json(
          { error: "Error creating user: " + insertError.message },
          { status: 500 }
        );
      }
      
      result = `Created admin user: ${username}`;
    }
    
    const { data: verifyUser, error: verifyError } = await supabase
      .from("User")
      .select("*")
      .eq("username", username)
      .single();
    
    let passwordMatch = false;
    if (verifyUser && !verifyError) {
      passwordMatch = await bcrypt.compare(password, verifyUser.password);
    }
    
    return NextResponse.json({
      success: true,
      message: result,
      passwordVerified: passwordMatch,
      user: verifyUser ? { username: verifyUser.username, role: verifyUser.role } : null
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create admin user" },
      { status: 500 }
    );
  }
}

