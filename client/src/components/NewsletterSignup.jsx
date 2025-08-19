import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message,setMessage]=useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual newsletter signup endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to your backend
      // await axios.post('/api/newsletter/subscribe', { email });
      
      setIsSubscribed(true);
      setMessage(resizeBy.data.message||"Subscribed Succesfully");
      setEmail('');
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-20 px-6 bg-gradient-to-r from-gray-700 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to EventSphere!
          </h2>
          <p className="text-xl mb-6">
            You've successfully subscribed to our newsletter. We'll keep you updated with the latest events and exclusive offers.
          </p>
          <button
            onClick={() => setIsSubscribed(false)}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition duration-200 font-semibold"
          >
            Subscribe Another Email
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay Updated with EventSphere
        </h2>
        <p className="text-xl mb-8 text-gray-200">
          Get notified about the latest events, exclusive offers, and insider tips delivered straight to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white/90 backdrop-blur-sm"
                disabled={isLoading}
              />
              {error && (
                <p className="text-red-200 text-sm mt-2 text-left">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Subscribing...
                </div>
              ) : (
                'Subscribe'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-gray-200 text-sm">
          <p>Join 10,000+ event enthusiasts who get our weekly updates</p>
          <p className="mt-2">No spam, unsubscribe at any time</p>
        </div>
        
        <div className="mt-8 flex justify-center items-center space-x-6 text-gray-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Weekly Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Exclusive Offers</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No Spam</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
