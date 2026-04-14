
package server

import (
	"encoding/json"
	"log"
	"net/http"
)

// StandardResponse defines the structure for all API responses
type StandardResponse struct {
	Status  string      `json:"status"`           // "success" or "error"
	Message string      `json:"message"`          // description
	Data    interface{} `json:"data,omitempty"`   // optional payload
}

// RespondJSON sends a JSON response with proper error handling and defaults
func RespondJSON(w http.ResponseWriter, statusCode int, status string, message string, data interface{}) {
	if status == "" {
		if statusCode >= 200 && statusCode < 300 {
			status = "success"
		} else {
			status = "error"
		}
	}

	if message == "" {
		if status == "success" {
			message = "Request successful"
		} else {
			message = "An error occurred"
		}
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(statusCode)

	response := StandardResponse{
		Status:  status,
		Message: message,
		Data:    data,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		// log the error for monitoring
		log.Printf("ERROR: Failed to encode JSON response: %v", err)

		// fallback response if encoding fails
		http.Error(w, `{"status":"error","message":"Internal Server Error"}`, http.StatusInternalServerError)
	}
}
