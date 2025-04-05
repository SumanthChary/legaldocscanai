
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
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">Optional Add-ons</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {addOns.map((addon) => (
          <div
            key={addon.name}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-2">{addon.name}</h3>
            <div className="text-2xl font-bold mb-2">{addon.price}</div>
            <p className="text-gray-600">{addon.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
