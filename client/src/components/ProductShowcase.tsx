import React, { useState } from "react";
import { API_URL } from "../App";
import { notify } from "../ts/utils/toast";
import ConfirmModal from "./ConfirmModal";

interface ProductProps {
    product: any;
    onClose: () => void;
}

const ProductShowcase: React.FC<ProductProps> = ({ product, onClose }) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    const buyProduct = async () => {
        let b = {
            id: product._id,
            name: product.storeName,
            url: product.imgUrl,
            price: product.price,
            assetType: product.assetType,
        };

        const res = await fetch(`${API_URL}/api/user/buy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `BEARER ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(b),
        });

        const data = await res.json();
        console.log(data);
        notify(data.message);
        setShowModal(false);
        onClose();
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[radial-gradient(ellipse_at_bottom,#32343756,black)] border-[#91919148] border text-white p-8 rounded-md w-1/3">
                <img
                    src={product.imgUrl}
                    alt={product.name}
                    className="w-full h-60 object-cover mb-4 rounded-md"
                />
                <h2 className="text-xl font-bold mb-2">{product.storeName}</h2>
                <p className="mb-2">Description : {product.description}</p>
                <p className="mb-4">Price: {product.price}</p>
                <button
                    className="mt-4 py-2 px-4 rounded-md  transition-transform duration-300 bg-[#64666b56] "
                    onClick={() => setShowModal(true)}
                >
                    Buy
                </button>
                <ConfirmModal
                    display={showModal}
                    displayFn={setShowModal}
                    onOkFn={buyProduct}
                    title="You want to buy this product?"
                    message="Are you sure you want to buy this product?"
                />

                <button className="ml-4 text-red-500" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ProductShowcase;
