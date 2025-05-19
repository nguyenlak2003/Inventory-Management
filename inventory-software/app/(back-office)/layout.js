"use client";

import React, { useEffect, useState} from "react";
import { useRouter, usePathname } from 'next/navigation'

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');

      if(!token) {
        router.replace('/');
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if(response.ok) {
          setIsLoading(false);
        } else {
          localStorage.removeItem('token');
          router.replace('/');
        }

      } catch (err) {
        console.error('Lỗi xác thực: ', err);
        localStorage.removeItem('token');
        router.replace('/');        
      }
    }

    verifyToken();
  }, [router, apiUrl, pathname]);

  if (isLoading) {
    return <div>Đang tải...</div>
  }


  return <>{children}</>
    
  
}
