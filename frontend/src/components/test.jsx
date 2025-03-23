import "./test.css"; // Pour le CSS
import { Button, HStack } from "@chakra-ui/react"

const Test = () => {
    return (
        <div>
           <h1>page for tests</h1>
           <HStack>
      <Button>Click me</Button>
      <Button>Click me</Button>
    </HStack>
        </div>
    );
};

export default Test;
