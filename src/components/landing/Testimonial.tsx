import { TbStar } from "react-icons/tb";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya & Arjun Sharma",
      location: "Delhi",
      text: "VipraPairwar helped us find each other while respecting our family traditions. The process was smooth and culturally appropriate."
    },
    {
      name: "Kavya & Rohit Mishra",
      location: "Varanasi",
      text: "We found our perfect match with compatible gothra and shared values. Thank you for preserving our sacred traditions."
    },
    {
      name: "Anjali & Vikram Joshi",
      location: "Pune",
      text: "The platform's focus on Brahmin heritage made our family comfortable and confident in the process."
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-orange-800 mb-4">Success Stories</h2>
          <p className="text-xl text-orange-600">Blessed unions from our Brahmin community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white  p-6 rounded-lg border-l-4 border-orange-600 shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <TbStar key={i} className="h-5 w-5 text-orange-600 fill-current" />
                ))}
              </div>
              <p className="text-orange-700 mb-4 italic">"{testimonial.text}"</p>
              <div className="font-semibold text-orange-800">{testimonial.name}</div>
              <div className="text-orange-600 text-sm">{testimonial.location}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TestimonialsSection;