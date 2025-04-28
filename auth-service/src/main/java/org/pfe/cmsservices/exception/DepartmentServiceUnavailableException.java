package org.pfe.cmsservices.exception;

public class DepartmentServiceUnavailableException extends RuntimeException {
  public DepartmentServiceUnavailableException(String message, Throwable cause) {
    super(message, cause);
  }

  public DepartmentServiceUnavailableException(String message) {
    super(message);
  }
}