import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-800 p-8 rounded-lg shadow-lg overflow-hidden text-center md:text-left min-h-[300px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1599688683398-0902a63d0c9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjc5ODV8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2b2x1bnRlZXJzfGVufDB8fHx8MTcyMDczOTQwNnww&ixlib=rb-4.0.3&q=80&w=1080"
          alt="Indian volunteers cleaning a park"
          className="absolute top-0 left-0 h-full w-full object-cover opacity-30"
          onError={(e) => { e.target.src = 'https://placehold.co/1200x500/065f46/a7f3d0?text=Eco+Sevaks'; e.target.onerror = null; }}
        />
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        <div className="relative z-10 p-4 md:p-8 md:w-2/3">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join the Green Movement in India.
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Find virtual and in-person environmental volunteer opportunities near you.
          </p>
          <Link to="/events" className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-hover transition-colors">
            Find an Event
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <Link to="/events" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <img src="https://images.unsplash.com/photo-1660816906120-870d60f0fa77?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2050" alt="Browse events illustration" className="w-full h-40 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-semibold mb-2">1. Browse</h3>
            <p className="text-gray-600">Find events by category, type, or location.</p>
          </Link>
          <Link to="/login" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <img src="https://images.unsplash.com/photo-1678699255640-a1b75cec7718?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340" alt="Join event illustration" className="w-full h-40 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-semibold mb-2">2. Join</h3>
            <p className="text-gray-600">Sign up for an event with one click.</p>
          </Link>
          <Link to="/login" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <img src="https://images.unsplash.com/photo-1607074245269-848539fe3335?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974" alt="Participate illustration" className="w-full h-40 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-semibold mb-2">3. Participate</h3>
            <p className="text-gray-600">Make a real difference for the environment.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}