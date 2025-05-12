------------------------------------------------------------------------------------------------------------------------------
-- CS 245
-- Assignment 1
-- Student Name: Ted Tschopp
-- Professor: Doctor Bell
-- Due Date: October 1st, 1989
-- Description: This program computes the greatest common divisor (GCD) of two positive integers using Euclid's algorithm.
--    The program prompts the user for two positive integers and then calculates and displays their GCD.
--    The GCD is calculated using a loop that continues until the second number becomes zero.
--    The program ensures that both inputs are positive integers and raises an error if they are not.
--    The GCD is returned as an integer value.
--    The program uses Ada's text I/O package for input and output operations.
--    The program is structured with a main procedure that contains the GCD function and handles user input and output.
--    The program is designed to be simple and efficient, demonstrating the use of loops and functions in Ada.
--    The program is written in Ada programming language and follows its syntax and conventions.
--    The program is intended for educational purposes and serves as an example of how to implement a basic algorithm in Ada.
--    The program is not intended for production use and may require additional error handling and validation for real-world applications.
--    The program is a simple implementation of the GCD algorithm and does not include advanced features or optimizations.
------------------------------------------------------------------------------------------------------------------------------

with Ada.Text_IO; use Ada.Text_IO;                                         -- Import Ada text I/O functionality

------------------------------------------------------------------------------------------------------------------------------
procedure Main is

   ------------------------------------------------------------------------------------------------------------------------------
   -- Function to compute GCD of two positive integers 
   -- using Euclid's algorithm
   ------------------------------------------------------------------------------------------------------------------------------
   function GCD(A, B: Integer) return Integer is                           -- Function signature
      X : Integer := A;                                                    -- Copy of first input
      Y : Integer := B;                                                    -- Copy of second input
   begin                                                                   -- Function body
      if X <= 0 or Y <= 0 then                                             -- Ensure both numbers are positive
         raise Constraint_Error with "Inputs must be positive integers.";  -- Raise an error if not
      end if;
      while Y /= 0 loop                                                    -- Repeat until remainder is zero
         declare                                                           --   declair a block to limit scope         
            Temp : Integer := Y;                                           --     Temporary variable to hold Y
         begin                                                             --   Begin block to limit scope
            Y := X mod Y;                                                  --     Set Y to remainder of X divided by Y
            X := Temp;                                                     --     Set X to prevous value of Y
         end;                                                              --   End block
      end loop;                                                            -- End loop when Y is zero
      return X;                                                            -- Return the greatest common divisor
   end GCD;                                                                
   ------------------------------------------------------------------------------------------------------------------------------

   A, B : Integer;                                                         -- Declare variables for user input

   ------------------------------------------------------------------------------------------------------------------------------
begin                                                                      
   Put("Enter first number: ");                                            -- Requst user for first input
   Get(A);                                                                 -- Read first number
   Put("Enter second number: ");                                           -- Prompt user for second input
   Get(B);                                                                 -- Read second number
   Put_Line("GCD is: " & Integer'Image(GCD(A, B)));                        -- Display result with formatting

end Main;
