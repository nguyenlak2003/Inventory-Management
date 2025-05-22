"use client";  
import React, { useState } from "react";  

function ContactTab() {  
 const [contactForm, setContactForm] = useState({  
   name: "",  
   message: "",  
 });  

 const handleContactSubmit = (event) => {  
   event.preventDefault();  
   // Simulate form submission  
   console.log("Form submitted:", contactForm);  
   setContactForm({  
     name: "",  
     message: "",  
   });  
 };  

 const updateContactForm = (field, value) => {  
   setContactForm((prev) => ({  
     ...prev,  
     [field]: value,  
   }));  
 };  

 return (  
   <section role="tabpanel" id="panel-contact" aria-labelledby="tab-contact">  
     <h2 className="mb-6 text-3xl text-zinc-900">Contact Support</h2>  
     <div className="grid gap-8 mb-8 grid-cols-[1fr_1fr] max-sm:grid-cols-[1fr]">  
       <img  
         alt="Customer support team"  
         src="https://images.pexels.com/photos/7731373/pexels-photo-7731373.jpeg"  
         className="object-cover overflow-hidden w-full rounded-lg aspect-square shadow-[0_4px_8px_rgba(0,0,0,0.1)]"  
       />  
       <form className="max-w-[600px]" onSubmit={handleContactSubmit}>  
         <div className="mb-5">  
           <label htmlFor="contact-name" className="mb-2 block">  
             Name  
           </label>  
           <input  
             id="contact-name"  
             type="text"  
             className="p-2.5 w-full rounded border border-solid border-zinc-500"  
             value={contactForm.name}  
             onChange={(event) =>  
               updateContactForm("name", event.target.value)  
             }  
           />  
         </div>  
         <div className="mb-5">  
           <label htmlFor="contact-message" className="mb-2 block">  
             Message  
           </label>  
           <textarea  
             id="contact-message"  
             className="p-2.5 w-full rounded border border-solid border-zinc-500 min-h-[150px]"  
             value={contactForm.message}  
             onChange={(event) =>  
               updateContactForm("message", event.target.value)  
             }  
           />  
         </div>  
         <button  
           type="submit"  
           className="px-8 py-3 bg-red-600 rounded cursor-pointer border-none text-white hover:bg-red-700 transition-colors"  
         >  
           Send Message  
         </button>  
       </form>  
     </div>  
     <div className="absolute bottom-2 right-2 flex gap-2">  
           <button className="w-12 h-12">  
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16,2c-7.732,0-14,6.268-14,14,0,6.566,4.52,12.075,10.618,13.588v-9.31h-2.887v-4.278h2.887v-1.843c0-4.765,2.156-6.974,6.835-6.974,.887,0,2.417,.174,3.043,.348v3.878c-.33-.035-.904-.052-1.617-.052-2.296,0-3.183,.87-3.183,3.13v1.513h4.573l-.786,4.278h-3.787v9.619c6.932-.837,12.304-6.74,12.304-13.897,0-7.732-6.268-14-14-14Z"></path></svg> 
           </button>  
           <button className="w-12 h-12 ">  
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fill-rule="evenodd"></path></svg>
           </button>  
           <button className="w-12 h-12 ">  
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M31.331,8.248c-.368-1.386-1.452-2.477-2.829-2.848-2.496-.673-12.502-.673-12.502-.673,0,0-10.007,0-12.502,.673-1.377,.37-2.461,1.462-2.829,2.848-.669,2.512-.669,7.752-.669,7.752,0,0,0,5.241,.669,7.752,.368,1.386,1.452,2.477,2.829,2.847,2.496,.673,12.502,.673,12.502,.673,0,0,10.007,0,12.502-.673,1.377-.37,2.461-1.462,2.829-2.847,.669-2.512,.669-7.752,.669-7.752,0,0,0-5.24-.669-7.752ZM12.727,20.758V11.242l8.364,4.758-8.364,4.758Z"></path></svg>  
           </button>  
         </div>
   </section>  
 );  
}  

export default ContactTab;
