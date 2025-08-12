import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: "🎯",
      title: "Easy Event Discovery",
      description: "Find events that match your interests with our intelligent recommendation system."
    },
    {
      icon: "📱",
      title: "Mobile-First Design",
      description: "Access events on any device with our responsive, mobile-optimized platform."
    },
    {
      icon: "🔒",
      title: "Secure Registration",
      description: "Safe and secure event registration with encrypted payment processing."
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description: "Track event performance and attendee engagement with detailed analytics."
    },
    {
      icon: "🌍",
      title: "Global Reach",
      description: "Connect with events and attendees from around the world."
    },
    {
      icon: "⚡",
      title: "Instant Updates",
      description: "Get real-time notifications about event changes and updates."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose EventSphere?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've built the most comprehensive event management platform to help you discover, 
            create, and attend amazing events with ease.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
