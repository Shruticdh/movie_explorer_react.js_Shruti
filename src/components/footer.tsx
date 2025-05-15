import React from "react";
import { FaFacebookF, FaTwitter, FaGithub, FaInstagram } from "react-icons/fa";
import AppStoreImg from "../assets/AppStore.jpg";
import GooglePlayImg from "../assets/playStore.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-10 px-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="hover:underline">Terms of Use</span>
            <span className="hover:underline">Privacy-Policy</span>
            <span className="hover:underline">Blog</span>
            <span className="hover:underline">FAQ</span>
            <span className="hover:underline">Watch List</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            © 2022 STREAMIT. All Rights Reserved. All videos and shows on this
            platform are trademarks of, and all related images and content are
            the property of, Streamit Inc. Duplication and copy of this is
            strictly prohibited. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-center">
          <h4 className="mb-3 font-semibold">Follow Us</h4>
          <div className="flex gap-4">
            <span>
              <FaFacebookF
                className="text-xl hover:text-gray-400"
                aria-label="Facebook"
              />
            </span>
            <span>
              <FaTwitter
                className="text-xl hover:text-gray-400"
                aria-label="Twitter"
              />
            </span>
            <span>
              <FaGithub
                className="text-xl hover:text-gray-400"
                aria-label="GitHub"
              />
            </span>
            <span>
              <FaInstagram
                className="text-xl hover:text-gray-400"
                aria-label="Instagram"
              />
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <h4 className="mb-3 font-semibold">Streamit App</h4>
          <div className="flex gap-4">
            <img src={AppStoreImg} alt="App Store" className="h-8" />
            <span>AppStore</span>
            <img src={GooglePlayImg} alt="Google Play Store" className="h-8" />
            <span>PlayStore</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
