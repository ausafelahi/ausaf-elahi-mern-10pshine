const features = [
  {
    title: "Fast Performance",
    description:
      "Optimized architecture ensures fast load times and smooth interactions.",
  },
  {
    title: "Secure by Design",
    description:
      "Modern security practices keep user data protected at all times.",
  },
  {
    title: "Scalable System",
    description: "Handles growth without performance drops or instability.",
  },
  {
    title: "Clean UI",
    description:
      "Simple, intuitive interface focused on clarity and usability.",
  },
];

const Features = () => {
  return (
    <div className="py-6 px-4 text-center md:py-2">
      <h1 className="font-bold text-4xl mb-8 text-teal-500">
        <h1>Feature of Nodus:</h1>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 justify-items-center">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-neutral-primary-soft w-full max-w-xs p-5 border border-default rounded-xl shadow-xs"
          >
            <h5 className="mb-2 text-xl font-semibold text-heading leading-7 text-teal-500">
              {feature.title}
            </h5>

            <p className="text-body mb-4">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
