
interface AddOnProps {
  name: string;
  price: string;
  description: string;
}

interface AddOnsProps {
  addOns: AddOnProps[];
}

export const AddOns = ({ addOns }: AddOnsProps) => {
  return (
    <div className="mt-12 md:mt-16 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Optional Add-ons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto">
        {addOns.map((addon) => (
          <div
            key={addon.name}
            className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200 transition-all hover:shadow-md"
          >
            <h3 className="text-base md:text-lg font-semibold mb-2">{addon.name}</h3>
            <div className="text-xl md:text-2xl font-bold mb-2 text-blue-600">{addon.price}</div>
            <p className="text-gray-600 text-sm md:text-base">{addon.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
