import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrintOrderForm from "@/components/PrintOrderForm";

const PrintOrder = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Print Order Service</h1>
            <p className="text-gray-600 mb-8">
              Upload your documents and specify your printing requirements
            </p>
            
            <PrintOrderForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrintOrder; 