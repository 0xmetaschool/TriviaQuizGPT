'use client';
import React from 'react';

const UpgradePage = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-black mb-8">Upgrade Your Trivia Experience</h2>
        <p className="text-lg text-gray-500 mb-12">
          Unlock advanced features and take your trivia game to the next level with our premium plans.
        </p>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Basic Plan */}
          <div className="space-y-2 border border-gray-300 rounded-lg p-6">
            <p className="text-2xl font-semibold text-black">Basic</p>
            <h3 className="text-3xl font-bold text-black">$0</h3>
            <p className="text-lg text-gray-500">per month</p>
            <div className="space-y-4 mt-4 text-justify">
              <p className="text-gray-600">- Limited trivia categories</p>
              <p className="text-gray-600">- Standard question types</p>
              <p className="text-gray-600">- Basic leaderboard access</p>
            </div>
            <button 
              className="mt-6 px-4 py-2 bg-gray-300 text-black rounded-lg cursor-not-allowed" 
              disabled>
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="space-y-2 border border-black rounded-lg p-6">
            <p className="text-2xl font-semibold text-black">Pro</p>
            <h3 className="text-3xl font-bold text-black">$9.99</h3>
            <p className="text-lg text-gray-500">per month</p>
            <div className="space-y-4 mt-4 text-left">
              <p className="text-gray-600">- Access to 20+ trivia categories</p>
              <p className="text-gray-600">- Advanced question types</p>
              <p className="text-gray-600">- Personalized quiz recommendations</p>
            </div>
            <button className="mt-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-500 transition"
                onClick={() => alert("This will be available in the next release")}>
                  Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="space-y-2 border border-gray-300 rounded-lg p-6">
            <p className="text-2xl font-semibold text-black">Enterprise</p>
            <h3 className="text-3xl font-bold text-black">Custom</h3>
            <p className="text-lg text-gray-500">per month</p>
            <div className="space-y-4 mt-4 text-left">
              <p className="text-gray-600">- Unlimited trivia categories</p>
              <p className="text-gray-600">- Customizable questions and difficulty levels</p>
              <p className="text-gray-600">- Full leaderboard integration</p>
            </div>
            <button className="mt-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-500 transition"
                onClick={() => alert("This will be available in the next release")}>
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Default export of the component
export default UpgradePage;
