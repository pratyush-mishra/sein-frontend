"use client"
import { Card } from "@heroui/card";
import { title } from "@/components/primitives";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { UserData, ProfileData } from "../api/Interfaces";
import { get_profile, patch_profile } from "../api/users/route";
// Fake profile data
const profile = {
  username: "johndoe",
  email: "johndoe@email.com",
  firstName: "John",
  lastName: "Doe",
  bio: "A passionate member of SEIN, sharing resources and knowledge.",
  contact_details: "123 Main St, City, Country | +1234567890",
  profile_picture: "https://randomuser.me/api/portraits/men/32.jpg",
};

export default function ProfilePage() {
  const [partialUser, setPartialUser] = useState<Partial<UserData>>({
    username: 'guest',
    profile_picture: '/default-avatar.png'
  });
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");
      console.log("Token: " + token);
      if (!token) {
        throw new Error("No authentication token found");
      }
      const userData = await get_profile(3, token);
      setPartialUser(userData);
    };
    fetchUserProfile();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData);
    let profileData: ProfileData = {};
    profileData.bio = formData.get("bio")?.toString();
    profileData.contact_details = formData.get("contact-info")?.toString();
    console.log(JSON.stringify(profileData));
    await patch_profile(token, profileData)
  }
  return (
    <div className="flex flex-col w-100 mt-10">
      <div className="flex flex-row m-4 gap-1">
        <div className="flex-1 align-middle w-64 me-4">
          <strong>
            Profile
          </strong>
        </div>
        <div className="text-left flex-grow basis-80 ">
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <strong>Username:</strong>
              <p>{partialUser.username}</p>
            </div>
            <div className="mb-4">
              <strong>First Name:</strong>
              <p>John</p>
            </div>
            <div className="mb-4">
              <strong>Last Name:</strong>
              <p>Doe</p>
            </div>
            <div className="mb-4">
              <strong>Email:</strong>
              <p className="">{partialUser.email}</p>
            </div>
            <div className="mb-4">
              <strong>About:</strong>
              <br />
              <textarea className="w-64 h-40 p-2 resize-none rounded-md" name="bio" defaultValue={partialUser.bio ? partialUser.bio : ""} placeholder="A short description about yourself or your organization."></textarea>
            </div>
            <div className="mb-4 gap-y-1">
              <strong>Contact Info:</strong>
              <br />
              <textarea className="w-64 h-32 p-2 resize-none rounded-md" name="contact-info" defaultValue={partialUser.contact_details ? partialUser.contact_details : ""} placeholder="Your contact info"></textarea>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onSubmit={() => {

            }}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
