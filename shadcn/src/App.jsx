import { Button } from "@/components/ui/button";
import "./App.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import React, { useState, useEffect } from "react";


function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="p-4">
      <Progress value={progress} />
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components and dependencies to your app using the cli.
        </AlertDescription>
      </Alert>
      <Accordion className="mb-4" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button variant="default" size="default">
        Default Button
      </Button>
      <Button variant="outline" size="lg">
        Outline Button
      </Button>
      <Button variant="destructive" size="sm">
        Destructive Button
      </Button>
    </div>
  );
}

export default App;
