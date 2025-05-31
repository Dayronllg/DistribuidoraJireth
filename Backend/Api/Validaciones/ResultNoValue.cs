using System;

namespace Api.Validaciones;

public class ResultNoValue
{
    public bool Success { get; private set; }
    public string Error { get; private set; }
    public bool Failed => !Success;


    private ResultNoValue(bool success, string error)
    {
        Success = success;
        Error = error;
    }

    public static ResultNoValue Ok()
    {
        return new ResultNoValue(true, null);
    }

    public static ResultNoValue Fail(string error) => new ResultNoValue(false, error);
}
