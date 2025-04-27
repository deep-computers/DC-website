import React from 'react';
import Header from "@/components/Header";
import BindingOrderForm from "@/components/BindingOrderForm";
import Footer from "@/components/Footer";

const BindingOrder = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BindingOrderForm />
      </main>
      <Footer />
    </div>
  );
};

export default BindingOrder; 