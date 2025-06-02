using System;
using Api.Models;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.EntityFrameworkCore;

namespace Api.Validaciones;

public class Result<T>
{

    public bool Success { get; private set; }
    public string Error { get; private set; }
    public T Value { get; private set; }
    
    Status? status { get; set; }
    

    public bool Failed => !Success;

    private Result(bool success, T value, string error, Status? status)
    {
        Success = success;
        Value = value;
        Error = error;
        this.status = status;
    }

    public static Result<T> Ok(T value) => new Result<T>(true, value, null, Status.Ok );
    public static Result<T> Fail(string error, Status? status=Status.None) => new Result<T>(false, default, error,status);

}


 






