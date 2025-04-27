import React from 'react';
import Header from "@/components/Header";
import PrintOrderForm from "@/components/PrintOrderForm";
import Footer from "@/components/Footer";

const PrintOrder = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PrintOrderForm />
      </main>
      <Footer />
    </div>
  );
};

export default PrintOrder; 