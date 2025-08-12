import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Organizer",
      company: "TechMeetups Inc.",
      content: "EventSphere has revolutionized how we manage our tech meetups. The platform is intuitive, and our attendees love the seamless registration process.",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Music Festival Director",
      company: "SoundWave Festivals",
      content: "Managing a 10,000-person festival has never been easier. The analytics and attendee management features are game-changers for our business.",
      avatar: "👨‍🎤",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Conference Attendee",
      company: "Marketing Professional",
      content: "I've attended over 20 events through EventSphere this year. The discovery features help me find relevant events, and the mobile app makes check-in a breeze.",
      avatar: "👩‍💻",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "Workshop Host",
      company: "Creative Workshops",
      content: "The platform's ease of use and professional features have helped me grow my workshop business by 300% in just one year.",
      avatar: "👨‍🎨",
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied event organizers and attendees who trust EventSphere 
            for their event management needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-gray-200/50 hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-8 bg-gray-200/50 backdrop-blur-sm px-8 py-4 rounded-full border border-gray-300/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">4.9/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">50K+</div>
              <div className="text-sm text-gray-600">Happy Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
