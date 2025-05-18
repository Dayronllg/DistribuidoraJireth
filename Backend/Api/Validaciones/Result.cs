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

    public bool Failed => !Success;

    private Result(bool success, T value, string error)
    {
        Success = success;
        Value = value;
        Error = error;
    }

    public static Result<T> Ok(T value) => new Result<T>(true, value, null);
    public static Result<T> Fail(string error) => new Result<T>(false, default, error);

}


 






