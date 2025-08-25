import {
  FooterCopyright,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import { BsGithub, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

const Footers = () => {
  return (
    <div className="bg-[#222733] text-white lg:pt-[100px]  p-5 rounded-none   ">
      <div className="w-full">
        <div className="grid  w-full justify-between lg:px-10 sm:flex sm:justify-between md:flex md:grid-cols-1 gap-y-10 pb-10">
          <div>
            <div className="py-2 mb-5 font-bold text-[18px] lg:text-[24px]">
              <h1>Rent a Ride</h1>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6 ">
            <div>
              <FooterTitle title="about" className="text-justify" />
              <FooterLinkGroup col>
                <FooterLink href="#">Rent a Ride</FooterLink>
                <FooterLink href="#">Car rental </FooterLink>
              </FooterLinkGroup>
            </div>
            {/* <div>
              {/* <FooterTitle title="Follow us" className="text-justify" /> */}
            {/* <FooterLinkGroup col> */}
            {/* <FooterLink href="https://github.com/jeevan-aj">Github</FooterLink> */}
            {/* <FooterLink href="#">Discord</FooterLink> */}
            {/* </FooterLinkGroup> */}
            {/* </div>  */}
            <div>
              <FooterTitle title="Legal" className="text-justify" />
              <FooterLinkGroup col>
                <FooterLink href="#">Privacy Policy</FooterLink>
                <FooterLink href="#">Terms &amp; Conditions</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <hr className="pt-10 lg:m-10 lg:px-10" />
        <div className="w-full sm:flex sm:items-center sm:justify-between lg:px-10 ">
          <FooterCopyright href="#" by="Rent a Ride" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            {/* <FooterIcon href="https://www.linkedin.com/in/jeevan-joji-25b799275/" icon={BsLinkedin} />
              <FooterIcon href="https://github.com/jeevan-aj" icon={BsGithub} /> */}
            {/* <FooterIcon href="#" icon={BsInstagram} title="Instagram" /> */}
            {/* <FooterIcon href="#" icon={BsInstagram} /> */}
            <FooterIcon href="#" icon={BsInstagram} />
            <FooterIcon href="#" icon={BsTwitter} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footers;
