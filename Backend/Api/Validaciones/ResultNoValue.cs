using System;

namespace Api.Validaciones;

public class ResultNoValue
{
    public bool Success { get; private set; }
    public string Error { get; private set; }
    public bool Failed => !Success;

   public Status? status { get; set; }

    private ResultNoValue(bool success, string error, Status? status)
    {
        Success = success;
        Error = error;
        this.status = status;
    }

    public static ResultNoValue Ok()
    {
        return new ResultNoValue(true, null, Status.Ok);
    }

    public static ResultNoValue Fail(string error, Status? status= Status.None) => new ResultNoValue(false, error,  status);
}
