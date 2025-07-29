
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button, Link } from "@heroui/react"

export default function TermsAndConditions() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Link href='#' onPress={onOpen}>Terms and Conditions</Link>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="2xl">
        <ModalContent>
          <ModalHeader>Resource Hub Terms and Conditions</ModalHeader>
          <ModalBody>
            <p><b>Last updated: 31 July 2025</b></p>
            <p>
              Welcome to SEIN's Resource Hub! By using our platform, you agree to abide by our terms and conditions. Please read them carefully before proceeding.
            </p>
            <p><b>1. Acceptance of Terms</b></p>
            <p>By accessing or using the Resource Hub, you agree to be bound by these Terms and Conditions. If you do not agree with these terms, please do not use the Resource Hub.</p>
            <p><b>2. User Conduct</b></p>
            <p>You agree to use the Resource Hub in accordance with all applicable laws and regulations. You are responsible for ensuring that your use of the Resource Hub complies with these terms.</p>
            <p><b>3. Intellectual Property</b></p>
            <p>All content on the Resource Hub is protected by copyright and other intellectual property laws. You may not use any content on the Resource Hub without the express permission of SEIN.</p>
            <p><b>4. Disclaimer</b></p>
            <p>The Resource Hub is provided "as is" without any warranties of any kind. SEIN does not guarantee the accuracy, completeness, or usefulness of any information or resources shared on the Resource Hub. You use the Resource Hub at your own risk.</p>
            <p><b>5. Limitation of Liability</b></p>
            <p>In no event will SEIN be liable for any indirect, incidental, special, consequential, or exemplary damages arising from your use of the Resource Hub.</p>
            <p><b>6. Changes to Terms</b></p>
            <p>SEIN reserves the right to update or modify these Terms and Conditions at any time without prior notice. You are responsible for regularly reviewing these terms.</p>
            <p><b>7. Contact Information</b></p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={onOpenChange}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}