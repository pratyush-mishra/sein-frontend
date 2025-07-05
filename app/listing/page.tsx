"use client";
import { useState, useMemo } from "react";
import { title } from "@/components/primitives" 
import { Card } from "@heroui/card";
import { Textarea } from "@heroui/input"
import { Input } from "@heroui/input";
import { Form, Radio, RadioGroup, NumberInput, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Select, SelectItem} from "@heroui/react";

export default function ListingPage() {
    const [isFee, setIsFee] = useState("no");
    const availability = [
        {key:"pickup", label:"Pick Up"},
        {key:"dropoff", label:"Drop Off"},
        {key:"onsite", label:"Only used on site"}
    ];
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className={title()}>Add new Resource</h1>
      <Card className="w-full max-w-md mt-8 p-6">
        <Form className="flex flex-col gap-4" encType="multipart/form-data" >
            <Input
                isRequired
                label="Title"
                labelPlacement="outside"
                name="title"
                placeholder="Enter title of the resource"
            />
            <Textarea
                label="Description"
                name="description"
                labelPlacement="outside"
                maxRows={4}
                placeholder="Give additional information about the resource"
            />
            <NumberInput
                isRequired
                label="Quantity"
                placeholder="Enter the quantity of item(s)"
            />
            <RadioGroup isRequired label="Is there any additional fee associated with this resource?" name="fee" value={isFee} defaultValue="no" orientation="horizontal" onValueChange={setIsFee}>
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
            </RadioGroup>

            <NumberInput
                label="Fee Amount (if applicable)"
                placeholder="NA"
                isRequired={isFee === "yes"}
            />

            <Textarea
                label="Measurement"
                name="measurement"
                labelPlacement="outside"
                maxRows={2}
                placeholder="Give measurements/dimensions or capacity of the item"
            />
            
            {/* <Dropdown>
                <DropdownTrigger>
                    <Button className="capitalize" variant="solid">
                        {selectedValue}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection={false}
                  aria-label="choose type of availability"
                  closeOnSelect={false}
                  selectedKeys={selectedAvailability}
                  selectionMode="multiple"
                  variant="flat"
                  onSelectionChange={handleSelectionChange}
                >
                    <DropdownItem key="pickup">Pick Up</DropdownItem>
                    <DropdownItem key="dropoff">Drop Off</DropdownItem>
                    <DropdownItem key="onsite">OnSite</DropdownItem>
                </DropdownMenu>
            </Dropdown> */}

            <Select
              label="Availabilty (you can choose multiple)"
              labelPlacement="outside"
              placeholder="Select availability"
              selectionMode="multiple"
            >
              {availability.map((availability) => (
                <SelectItem key={availability.key}>{availability.label}</SelectItem>
              ))}
            </Select>
            
            <Textarea
                label="Condition"
                name="condition"
                labelPlacement="outside"
                maxRows={2}
                placeholder="Describe the condition of item"
            />

        </Form>
      </Card>
    </div>
  );
}