import { useState } from "react";
import { API_URL } from "../App";
import { notify } from "../ts/utils/toast";

interface Product {
    name: string;
    price: number;
    image: string;
    description: string;
    assetType: string;
}

const ListProductPage = () => {
    const [productDetails, setProductDetails] = useState<Product>({
        name: "",
        price: 0,
        image: "",
        description: "",
        assetType: "physical",
    });
    const [submittedProduct, setSubmittedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        const payload = [{
            storeName: productDetails.name,
            price: productDetails.price,
            imgUrl: productDetails.image,
            description: productDetails.description,
            assetType: productDetails.assetType,
        }];

        try {
            const response = await fetch(`${API_URL}/api/community/product/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `BEARER ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmittedProduct(data.data);
                setProductDetails({ name: "", price: 0, image: "", description: "", assetType: "physical" });
                notify("Product listed successfully!");
            } else {
                notify("Error creating product.");
                setErrorMessage(data.message || "Failed to list product.");
            }
        } catch (error) {
            notify("Error creating product.");
            setErrorMessage("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
            <div className="w-full max-w-2xl p-8 rounded-lg shadow-xl bg-black border border-neon-blue">
                <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">List a New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-purple-400 mb-2">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={productDetails.name}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-purple-400 mb-2">Price (in credits)</label>
                        <input
                            type="number"
                            name="price"
                            value={productDetails.price}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-purple-400 mb-2">Product Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={productDetails.image}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                    <div>
                        <label className="block text-purple-400 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={productDetails.description}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            rows={4}
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-purple-400 mb-2">Asset Type</label>
                        <select
                            name="assetType"
                            value={productDetails.assetType}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="physical">Physical</option>
                            <option value="software">Software</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg text-white ${isLoading ? "bg-purple-600" : "bg-purple-500 hover:bg-purple-600"} transition duration-300`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Listing Product..." : "List Product"}
                    </button>
                </form>

                {submittedProduct && (
                    <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-neon-blue text-center">
                        <h3 className="text-xl font-bold text-purple-400 mb-4">Submitted Product:</h3>
                        <img src={submittedProduct.image} alt={submittedProduct.name} className="w-48 h-48 object-cover mx-auto rounded-lg shadow-md mb-4" />
                        <h4 className="text-lg font-bold">{submittedProduct.name}</h4>
                        <p className="text-gray-400">Price: {submittedProduct.price} credits</p>
                        <p className="text-gray-400">Type: {submittedProduct.assetType}</p>
                        <p className="text-gray-400 mt-2">{submittedProduct.description}</p>
                    </div>
                )}

                {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default ListProductPage;
