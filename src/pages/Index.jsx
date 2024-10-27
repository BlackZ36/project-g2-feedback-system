import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  useEffect( () => {
    document.title = "TFS - HOME";
  }, [])
  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: "calc(100vh - 4.05rem)" }}>
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/hero-services-img.webp')",
          width: "100%", // Chiều rộng của div 100% để vừa với chiều rộng màn hình
          height: "auto", // Chiều cao tự động để giữ tỉ lệ ảnh
          backgroundSize: "contain", // Thay đổi thành 'contain' để giữ nguyên tỉ lệ của ảnh
          backgroundRepeat: "no-repeat", // Ngăn ảnh lặp lại
          backgroundPosition: "center",
        }}
      />

      <div className="absolute inset-0 bg-black opacity-50 z-10" />

      <div className="relative z-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          WELCOME TO <br /> <p className="my-5 text-orange-500">TFS</p>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8">Teacher Feedback System</p>
        <Link to="/home">
          <Button size="lg" className="text-lg px-8 py-6">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
