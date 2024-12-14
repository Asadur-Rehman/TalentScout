import React, { useState } from "react";
import Group5 from "../assets/Group 5.svg";

const faqs = [
  {
    question: "How do I prepare my bottles and cans for return?",
    answer:
      "Please place plastic bottles and aluminum cans in bags. It's extra helpful to use the bags we supply. For our employees' safety, glass must be separated into cardboard boxes or totes and will not be accepted in bags.",
  },
  {
    question: "How do I get paid for my returns?",
    answer:
      "Payments are processed directly through our system. You'll receive compensation based on the number of returned containers.",
  },
  {
    question: "Is there a limit to how many containers I can return at once?",
    answer:
      "There is no strict limit, but we encourage customers to contact us for large quantities so we can assist efficiently.",
  },
];

const FAQPage = () => {
  //   const [openIndex, setOpenIndex] = useState(null);

  //   const toggleFAQ = (index) => {
  //     setOpenIndex(openIndex === index ? null : index);
  //   };

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="height-max"
      style={{ backgroundColor: "#9EE4F2", height: "100vh", margin: 0 }}
    >
      <header className="flex justify-between items-center p-4 bg-white">
        <div className="flex justify-between items-center">
          <img src={Group5} alt="TalentScout" className="w-30 h-15" />
          <h1 className="text-2xl font-bold text-gray-700 mx-10">
            FREQUENTLY ASKED QUESTIONS
          </h1>
        </div>
        <button
          className="text-white px-8 py-2 rounded hover:bg-blue-800"
          style={{ backgroundColor: "#144066" }}
          onClick={() => (window.location.href = "/job-application")}
        >
          Job Applicaiton
        </button>
      </header>

      <section className="mb-8 border-b pb-6 bg-white m-8 p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#144066" }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden bg-[#9EE4F2] transition-colors duration-200"
            >
              <button
                className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
                style={{ color: "#069DD1" }}
              >
                <span className="font-medium">{faq.question}</span>
                <span className="text-4xl font-bold">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="p-4 bg-[#9EE4F2] text-[#202020]">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
