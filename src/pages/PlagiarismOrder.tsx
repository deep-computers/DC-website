import React from 'react';
import Header from "@/components/Header";
import PlagiarismOrderForm from "@/components/PlagiarismOrderForm";
import Footer from "@/components/Footer";

const PlagiarismOrder = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PlagiarismOrderForm />
      </main>
      <Footer />
    </div>
  );
};

export default PlagiarismOrder; 