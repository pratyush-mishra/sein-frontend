
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button, Link } from "@heroui/react"

export default function TermsAndConditions() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Link href='#' onPress={onOpen}>Terms and Conditions</Link>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="3xl">
        <ModalContent>
          <ModalHeader>Resource Hub Terms and Conditions</ModalHeader>
          <ModalBody>
            <p>Last Updated: 29 July 2025</p>
            <p>
              Welcome to SEIN&rsquo;ss Resource Hub! By using the Resource Hub, you agree to the following terms of use. These terms of use may change occasionally and the date listed above will be updated. It is your responsibility to review these terms for any changes and your use of Resource Hub implies your agreement to the current terms of use published here.
            </p>
            <p><b>Privacy Policy</b></p>
            <p>
              We collect a variety of information from your use of the Resource Hub. Please see our <Link href="/privacy-policy">Privacy Policy </Link>to learn what information we collect and how we use it We reserve the right to suspend or terminate accounts that violate these Terms or engage in harmful behavior. Users may request to delete their accounts at any time. For more information on how we deal with your data, please refer to our privacy policy.
            </p>
            <p><b>Posting resources</b></p>
            <p>In order to post resources on the Resource Hub you must be a SEIN member, and you must agree to follow all the guidelines outlined in the SEIN Member Handbook, and in these terms and conditions.
            When you sign up to the site, SEIN will double check your authorization to post, by confirming your membership.
            Only items that you actually own, or have possession of are able to be posted. Members are expected to always be respectful and polite when posting and communicating with other members.
            In more detail, the following are not allowed in posts or in messages to other members:
            No buying, selling, trading, bartering or requesting money
            No alcohol, tobacco, weapons or prescription drugs
            No services or jobs
            No promotions or advertising
            No real estate, rentals or housing
            No spamming
            Further, you agree that the Resource Hub is made available for your personal or organisation use only.
            You also take sole responsibility for anything you post on the Resource Hub and understand that SEIN makes no guarantees as to the accuracy or validity of submissions made by others.</p>
            <p><b>Interactions</b></p>
            <p>By using the Resource Hub, you are able to interact with other people. You take sole responsibility for all your interactions with others on the Resource Hub. SEIN does not moderate submissions or interactions, so it is up to each individual using the site to judge the accuracy, integrity, and quality of others and their submissions</p>
            <p>SEIN asks that all members be guided by our agreements in the SEIN member’s handbook.  We reserve the right to end use of the site for anyone who violates the terms and conditions outlined in the handbook.</p>
            <p><b>Responsibilities and Liability</b></p>
            <p>SEIN does not own, inspect, or guarantee the condition of shared items. All transactions are at users’ own risk. We are not liable for loss, damage, theft, or personal injury arising from shared items.</p>
            <p>While we provide a basic messaging feature to register interest, users are encouraged to connect outside the platform to coordinate the logistics of obtaining/returning resources between each other. SEIN cannot guarantee the security of any sensitive information being exchanged through its text channels and we dissuade any exchange of such information on our platform.</p>
            <p><b>Contact</b></p>
            <p>If you have any questions or concerns about the Resource Hub or these terms of use, feel free to contact us using the contact form on the main SEIN page <Link href="https://www.seinglasgow.org.uk/contact">here</Link></p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={onOpenChange}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}