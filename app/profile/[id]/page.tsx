import { Card } from "@heroui/card";
import { title } from "@/components/primitives";

// Fake profile data
const profile = {
  username: "john doe",
  email: "johndoe@email.com",
  bio: "A passionate member of SEIN, sharing resources and knowledge.",
  contact_details: "123 Main St, City, Country | +1234567890",
  profile_picture: "https://randomuser.me/api/portraits/men/32.jpg",
};

export default async function Profile(props: any) {
  const params = await props.params;
  const id = params.id;
  console.log("id: " + id);
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-md mt-8 p-6 flex flex-col items-center">
        <img
          src={profile.profile_picture}
          alt={profile.username}
          className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary"
        />
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1">{profile.username}</h2>
          <p className="text-default-500 mb-2">{profile.email}</p>
          <p className="text-default-600 mb-4">{profile.bio}</p>
        </div>
      </Card>
    </div>
  )
}