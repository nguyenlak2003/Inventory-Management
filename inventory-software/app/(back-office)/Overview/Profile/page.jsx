"use client";  
import React from "react";  
import AccountDetailsCard from "./AccountDetailsCard";  
import PasswordChangeCard from "./PasswordChangeCard";  
import UsernameChangeCard from "./UsernameChangeCard";  
import Button from "./Button";  
import SidebarMenu from "../SidebarMenu/SidebarMenu"; // Adjust the path if needed  

function AccountManagement() {  
 const handleLogout = () => {  
   // Simulate logout  
   console.log("Logging out...");  
 };  

 return (  
   <div className="flex min-h-screen bg-white">  
     <SidebarMenu />  
     <section className="p-10 flex-1">  
       <article className="p-8 mx-auto my-0 rounded-lg max-w-[1200px] shadow-[0_0_20px_rgba(0,0,0,0.1)]">  
         <h1 className="mb-8 text-3xl text-red-600">Account Management</h1>  

         <div className="grid gap-8 mb-10 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">  
           <AccountDetailsCard />  
           <PasswordChangeCard />  
           <UsernameChangeCard />  
         </div>  

         <footer className="pt-8 mt-10 text-center border-t border-solid border-t-zinc-100">  
           <Button  
             onClick={handleLogout}  
             variant="dark"  
             aria-label="Log out of account"  
           >  
             Log Out  
           </Button>  
         </footer>  
       </article>  
     </section>  
   </div>  
 );  
}  

export default AccountManagement;
