import { Request, Response } from "express";
import { GetAllEmployeesFromJSON ,WriteBackArrayToJSON} from "../services/employee.service";
import {employeeRequestSchema,EmployeeRequest, EmployeeDef, ErrorResponse,GetAllEmployeeResponse, EmployeeReqToDef, getAllEmployeesResponse, errorResponseSchema,CreateZODErrorString } from "../models/employee.model"
import Zod from 'zod'
import { NextFunction } from "connect";
import errorMap from "zod/lib/locales/en";


export function GetAllEmployees(req:Request, res:Response, next:NextFunction) 
{
    try
    {
        //call getAllUsersFromService

        return res.status(200).json({'employees' : GetAllEmployeesFromJSON()});
    }
    catch (e)
    {
        let json_msg = errorResponseSchema.parse({errorMessage:"Database doesn't exist"});
        return res.status(500).json(json_msg);
    }
}

export function AddNewEmployee(req:Request, res:Response, next:NextFunction)
{
    try
    {

        // try to validate, if cannot, then it will throw exception
        const data_aft_validation = employeeRequestSchema.parse(req.body);
   
        //get entire array
        let emp_arr = GetAllEmployeesFromJSON();
        const new_id:number = emp_arr[(emp_arr.length -1)].id + 1;
        


        const new_employee:EmployeeDef = {  id:new_id, 
                                            name: data_aft_validation.name,
                                            salary:data_aft_validation.salary,
                                            department:data_aft_validation.department 
                                        };

        emp_arr.push(new_employee);


        //writeback to the json db
        WriteBackArrayToJSON(emp_arr);


        //if not exceptions thrown
        return res.status(200).json(new_employee);
    }
    catch(error)
    {
        if(error instanceof Zod.ZodError)
        {
            let json_msg = errorResponseSchema.parse({errorMessage:CreateZODErrorString(error)});
            return res.status(400).json(json_msg);
        }
        else
        {
            let json_msg = errorResponseSchema.parse({errorMessage:"Database doesn't exist"});
            return res.status(500).json(json_msg).send("Server Error");
        }
    }

    
    // do validation checking

}

export function GetEmployeeByID(req:Request<{emp_id:string},{},{},{}>, res:Response, next:NextFunction)
{
    try
    {
        let emp_arr = GetAllEmployeesFromJSON();

        let found_emp = emp_arr.find((emp)=>
        {
            return emp.id == parseInt(req.params.emp_id);
        })

        if(found_emp === undefined) throw new Error("Employee of that ID not found")

        return res.status(200).json(found_emp).send("successful operation");
        
    }
    catch(e : any)
    {
        if(e.syscall !== undefined)
        {
            let json_msg = errorResponseSchema.parse({errorMessage:"Database doesn't exist"});
            return res.status(500).json(json_msg).send("Server Error");
        }
        else
        {
            let json_msg = errorResponseSchema.parse({errorMessage:"Employee ID of id,"+ req.params.emp_id+" not found"});
            return res.status(404).json(json_msg);
        }
    }   
}

export function UpdateEmployeeByID(req:Request<{emp_id:string},{},{},{}>, res:Response, next:NextFunction)
{
    //console.log(req.params.emp_id);
    //console.log(req.body);

    try
    {
        let body_json : EmployeeRequest = employeeRequestSchema.parse(req.body);

        //check if the id exists
        
        //get array
        let emp_arr:EmployeeDef[] = GetAllEmployeesFromJSON();

        let found_emp = emp_arr.find((emp)=>
        {
            return emp.id == parseInt(req.params.emp_id);
        })


            //NOTE: FOUND_EMP IS BY REFERENCE

        if(found_emp === undefined)
            throw new ReferenceError() //reference error
        else if( JSON.stringify(EmployeeReqToDef(parseInt(req.params.emp_id),body_json) ) == JSON.stringify(found_emp))
        {
            throw Error("No Change 304")//
        }


        //change on array via reference 
        //@ts-ignore
        found_emp.name = req.body.name;
        //@ts-ignore
        found_emp.salary = req.body.salary;
        //@ts-ignore
        found_emp.department = req.body.department;

        //writeback to array
        WriteBackArrayToJSON(emp_arr);

        return res.status(200).send(found_emp);
    }
    catch(error)
    {
        if(error instanceof ReferenceError) // done
        {
            let json_msg = errorResponseSchema.parse({errorMessage:"Employee ID of id,"+ req.params.emp_id+" not found"});
            return res.status(404).json(json_msg).send("Not Found");
        }
        else if(error instanceof Zod.ZodError) // done
        {
            let json_msg = errorResponseSchema.parse({errorMessage:CreateZODErrorString(error)});
            return res.status(400).json(json_msg).send("Bad Request")
        }
        
        else if(error instanceof Error && error.message == "No Change 304") // done
        {
            return res.status(304);
        }
        else
        {
            let json_msg = errorResponseSchema.parse({errorMessage:"Database doesn't exist"});
            return res.status(500).json(json_msg).send("Server Error");
        }
    }
}

export function DeleteEmployeeByID(req:Request<{emp_id:string},{},{},{}>, res:Response, next:NextFunction)
{
    try
    {
        let emp_arr = GetAllEmployeesFromJSON();
        // find in arr
        let found_emp = emp_arr.find((emp)=>
        {
            return emp.id == parseInt(req.params.emp_id);
        })

        //throw e if not found
        if(found_emp === undefined) throw new Error("Employee of that ID not found")

        //remove the found emp from the array
        emp_arr = emp_arr.filter((emp)=>
        {
            return emp !== found_emp;
        })
        
        //write back to json db
        WriteBackArrayToJSON(emp_arr);

        return res.send(204);
            

    }
    catch(error)
    {
        // 404 not found
        if(error instanceof Error && error.message == "Employee of that ID not found")
        {
            let json_msg = errorResponseSchema.parse({errorMessage:"Employee ID of id,"+ req.params.emp_id+" not found"});
            return res.status(404).json(json_msg);
        }
        else
        {
            let json_msg = errorResponseSchema.parse({errorMessage:"Database doesn't exist"});
            return res.status(500).json(json_msg);
        }

        
    }
}
