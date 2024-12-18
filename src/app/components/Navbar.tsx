import Image from "next/image";
import logo from "@/img/logo.jpg";

export default function Navbar() {
    return (
        <header className="bg-orange-400 text-white p-4">
            <div className="max-w-7xl mx-auto flex items-center">
                <Image src={logo} alt="App Logo" className="w-14 h-14 mr-4 rounded-lg" />
                <h1 className="text-xl font-bold">Baltalka</h1>
            </div>
        </header>
    );
}
