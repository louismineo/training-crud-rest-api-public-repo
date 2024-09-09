import { NextFunction } from 'connect'
import { EmployeeDef,EmployeeRequest,GetAllEmployeeResponse } from '../models/employee.model'
import { array } from 'zod'
import  path from 'path'

import { readFile, readFileSync, writeFileSync } from 'fs';

const relative_file_path = '../Database/EmployeeDB.json';

export function GetAllEmployeesFromJSON() : GetAllEmployeeResponse
{
    //read from json file
    const json = readFileSync(path.resolve(__dirname,relative_file_path),'utf-8');
    //
    const parsed_data = JSON.parse(json);

    const employees : GetAllEmployeeResponse = parsed_data.employees;

    return employees;
}

/*
export function AddEmployeeIntoJSON(employee: EmployeeRequest )
{
    //this is under the assumption that 
    //DATA IS VALIDATED FROM CONTROLLER

    //read the file and get the last id 
    try
    {
        const fileread = readFileSync(path.resolve(__dirname,relative_file_path),'utf-8');
        const parsed_data = JSON.parse(fileread)
        const new_id:number = parseInt(parsed_data.Employees[parsed_data.Employees.length -1]['id'])+1;
        
        const new_employee:EmployeeDef = {id:new_id, name: employee.name, salary:employee.salary, department:employee.department };

        parsed_data.Employees.push(new_employee);

        console.log(parsed_data)
        //write to json
        writeFileSync(path.resolve(__dirname, relative_file_path), JSON.stringify(parsed_data, null, 2));
    }
    catch(error)
    {
        console.log(error);
    }
    

}
*/

export function WriteBackArrayToJSON(emp_arr:GetAllEmployeeResponse)
{
    let json_string = {'employees' : emp_arr}

    writeFileSync(path.resolve(__dirname, relative_file_path), JSON.stringify(json_string, null, 2));
}