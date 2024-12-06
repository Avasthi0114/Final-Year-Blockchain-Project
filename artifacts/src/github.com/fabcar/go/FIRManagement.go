package main

// import (
// 	"encoding/json"
// 	"fmt"

// 	"github.com/hyperledger/fabric-chaincode-go/shim"
// 	sc "github.com/hyperledger/fabric-protos-go/peer"
// )

import (
 "bytes"
 "encoding/json"
 "fmt"
 "strconv"
 "time"

 "github.com/hyperledger/fabric-chaincode-go/shim"
 sc "github.com/hyperledger/fabric-protos-go/peer"
 
)

// SmartContract structure
type SmartContract struct {
}

// FIR structure
type FIR struct {
    ComplaintID    string          `json:"complaint_id"`
    OfficerDetails OfficerDetails  `json:"officer_details"`
    EvidenceHash   string          `json:"evidence_hash"`
    FIRHash        string          `json:"fir_hash"`
    DocumentDetails DocumentDetails `json:"document_details"`
    History        []string        `json:"history"` 
}


// OfficerDetails structure
type OfficerDetails struct {
	OfficerID       string `json:"officer_id"`
	PoliceStationID string `json:"police_station_id"`
	DateFrom        string `json:"date_from"`
	DateTo          string `json:"date_to"`
}

// DocumentDetails structure
type DocumentDetails struct {
	DocumentID   string `json:"document_id"`
	DocumentName string `json:"document_name"`
}

// Init initializes the smart contract
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

// Invoke routes function calls to the appropriate method
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	function, args := APIstub.GetFunctionAndParameters()

	switch function {
	case "addComplaint":
		return s.addComplaint(APIstub, args)
	case "changeOfficer":
		return s.changeOfficer(APIstub, args)
	case "updateEvidenceHash":
		return s.updateEvidenceHash(APIstub, args)
	case "getFIRHash":
		return s.getFIRHash(APIstub, args)
	case "getOfficerDetails":
		return s.getOfficerDetails(APIstub, args)
	case "getComplaintDetails":
		return s.getComplaintDetails(APIstub, args)
	case "getComplaintHistory":
		return s.getComplaintHistory(APIstub, args) 
	default:
		return shim.Error("Invalid Smart Contract function name.")
	}
}

// addComplaint adds a new complaint to the ledger
func (s *SmartContract) addComplaint(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 8 {
		return shim.Error("Incorrect number of arguments. Expecting 8.")
	}

	complaintID := args[0]
	officerID := args[1]
	policeStationID := args[2]
	evidenceHash := args[3]
	firHash := args[4]
	documentID := args[5]
	documentName := args[6]
	dateFrom := args[7]

	// Create OfficerDetails struct
	officerDetails := OfficerDetails{
		OfficerID:       officerID,
		PoliceStationID: policeStationID,
		DateFrom:        dateFrom,
		DateTo:          "", // Initially empty as the officer is currently handling the case
	}

	// Create DocumentDetails struct
	documentDetails := DocumentDetails{
		DocumentID:   documentID,
		DocumentName: documentName,
	}

	// Create the FIR struct
	fir := FIR{
		ComplaintID:    complaintID,
		OfficerDetails: officerDetails,
		EvidenceHash:   evidenceHash,
		FIRHash:        firHash,
		DocumentDetails: documentDetails,
	}

	// Convert FIR struct to JSON
	firAsBytes, err := json.Marshal(fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal FIR: %s", err.Error()))
	}

	// Save FIR record to the ledger
	err = APIstub.PutState(complaintID, firAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to add complaint: %s", err.Error()))
	}

	return shim.Success(nil)
}

// changeOfficer updates the officer details and sets DateTo for the previous officer
// func (s *SmartContract) changeOfficer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 4 {
// 		return shim.Error("Incorrect number of arguments. Expecting 4.")
// 	}

// 	complaintID := args[0]
// 	newOfficerID := args[1]
// 	newPoliceStationID := args[2]
// 	newDateFrom := args[3]

// 	// Get the FIR record
// 	firAsBytes, err := APIstub.GetState(complaintID)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to get FIR: %s", err.Error()))
// 	} else if firAsBytes == nil {
// 		return shim.Error(fmt.Sprintf("FIR with ComplaintID %s not found.", complaintID))
// 	}

// 	// Unmarshal FIR
// 	var fir FIR
// 	err = json.Unmarshal(firAsBytes, &fir)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to unmarshal FIR: %s", err.Error()))
// 	}

// 	// Update DateTo for the old officer
// 	fir.OfficerDetails.DateTo = newDateFrom

// 	// Assign new officer details
// 	fir.OfficerDetails.OfficerID = newOfficerID
// 	fir.OfficerDetails.PoliceStationID = newPoliceStationID
// 	fir.OfficerDetails.DateFrom = newDateFrom
// 	fir.OfficerDetails.DateTo = ""

// 	// Marshal the updated FIR back to JSON
// 	firAsBytes, err = json.Marshal(fir)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
// 	}

// 	// Update FIR in the ledger
// 	err = APIstub.PutState(complaintID, firAsBytes)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to change officer for FIR %s: %s", complaintID, err.Error()))
// 	}

// 	return shim.Success(nil)
// }


func (s *SmartContract) changeOfficer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4.")
	}

	complaintID := args[0]
	newOfficerID := args[1]
	newPoliceStationID := args[2]
	newDateFrom := args[3]

	// Get the FIR record
	firAsBytes, err := APIstub.GetState(complaintID)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to get FIR: %s", err.Error()))
	} else if firAsBytes == nil {
		return shim.Error(fmt.Sprintf("FIR with ComplaintID %s not found.", complaintID))
	}

	// Unmarshal FIR
	var fir FIR
	err = json.Unmarshal(firAsBytes, &fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal FIR: %s", err.Error()))
	}

	// Debug: Check current officer details
	fmt.Printf("Current Officer Details: %+v\n", fir.OfficerDetails)

	// Update DateTo for the old officer
	if fir.OfficerDetails.DateTo != "" {
		fmt.Printf("Warning: DateTo already set to %s. Overwriting with new DateTo: %s\n", fir.OfficerDetails.DateTo, newDateFrom)
	}
	fir.OfficerDetails.DateTo = newDateFrom

	// Debug: Check if DateTo was updated
	fmt.Printf("Updated Officer Details (DateTo): %+v\n", fir.OfficerDetails)

	// Assign new officer details
	fir.OfficerDetails.OfficerID = newOfficerID
	fir.OfficerDetails.PoliceStationID = newPoliceStationID
	fir.OfficerDetails.DateFrom = newDateFrom
	fir.OfficerDetails.DateTo = ""

	// Debug: Check new officer details
	fmt.Printf("New Officer Details: %+v\n", fir.OfficerDetails)

	// Marshal the updated FIR back to JSON
	firAsBytes, err = json.Marshal(fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
	}

	// Update FIR in the ledger
	err = APIstub.PutState(complaintID, firAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change officer for FIR %s: %s", complaintID, err.Error()))
	}

	return shim.Success(nil)
}



// updateEvidenceHash adds new evidence (updates the EvidenceHash and DocumentDetails)
func (s *SmartContract) updateEvidenceHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3.")
	}

	complaintID := args[0]
	newEvidenceHash := args[1]
	newDocumentName := args[2]

	// Get the FIR record
	firAsBytes, err := APIstub.GetState(complaintID)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to get FIR: %s", err.Error()))
	} else if firAsBytes == nil {
		return shim.Error(fmt.Sprintf("FIR with ComplaintID %s not found.", complaintID))
	}

	// Unmarshal FIR
	var fir FIR
	err = json.Unmarshal(firAsBytes, &fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal FIR: %s", err.Error()))
	}

	// Update the EvidenceHash and DocumentDetails
	fir.EvidenceHash = newEvidenceHash
	fir.DocumentDetails.DocumentName = newDocumentName

	// Marshal the updated FIR back to JSON
	firAsBytes, err = json.Marshal(fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
	}

	// Update FIR in the ledger
	err = APIstub.PutState(complaintID, firAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to add evidence for FIR %s: %s", complaintID, err.Error()))
	}

	return shim.Success(nil)
}

// getFIRHash retrieves the FIRHash using ComplaintID
func (s *SmartContract) getFIRHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1.")
	}

	complaintID := args[0]

	// Get the FIR record
	firAsBytes, err := APIstub.GetState(complaintID)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to get FIR: %s", err.Error()))
	} else if firAsBytes == nil {
		return shim.Error(fmt.Sprintf("FIR with ComplaintID %s not found.", complaintID))
	}

	// Unmarshal FIR
	var fir FIR
	err = json.Unmarshal(firAsBytes, &fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal FIR: %s", err.Error()))
	}

	// Return the FIRHash
	return shim.Success([]byte(fir.FIRHash))
}

// getOfficerDetails retrieves the OfficerDetails using ComplaintID
func (s *SmartContract) getOfficerDetails(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1.")
	}

	complaintID := args[0]

	// Get the FIR record
	firAsBytes, err := APIstub.GetState(complaintID)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to get FIR: %s", err.Error()))
	} else if firAsBytes == nil {
		return shim.Error(fmt.Sprintf("FIR with ComplaintID %s not found.", complaintID))
	}

	// Unmarshal FIR
	var fir FIR
	err = json.Unmarshal(firAsBytes, &fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal FIR: %s", err.Error()))
	}

	// Marshal OfficerDetails to JSON
	officerDetailsAsBytes, err := json.Marshal(fir.OfficerDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal OfficerDetails: %s", err.Error()))
	}

	return shim.Success(officerDetailsAsBytes)
}

// getComplaintDetails retrieves the full complaint details
func (s *SmartContract) getComplaintDetails(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1.")
	}

	complaintID := args[0]

	// Get the FIR record
	firAsBytes, err := APIstub.GetState(complaintID)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to get FIR: %s", err.Error()))
	} else if firAsBytes == nil {
		return shim.Error(fmt.Sprintf("FIR with ComplaintID %s not found.", complaintID))
	}

	// Return the FIR details
	return shim.Success(firAsBytes)
}


     func (t *SmartContract) getComplaintHistory(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	 if len(args) < 1 {
	     return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
	
	 complaintID := args[0]
	
	 resultsIterator, err := stub.GetHistoryForKey(complaintID)
	 if err != nil {
	     return shim.Error(err.Error())
	 }
	 defer resultsIterator.Close()
	
	 // buffer is a JSON array containing historic values for the marble
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
	
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
	     response, err := resultsIterator.Next()
	     if err != nil {
	         return shim.Error(err.Error())
	     }
	     // Add a comma before array members, suppress it for the first array member
	     if bArrayMemberAlreadyWritten == true {
	         buffer.WriteString(",")
	     }
	     buffer.WriteString("{\"TxId\":")
	     buffer.WriteString("\"")
	     buffer.WriteString(response.TxId)
	     buffer.WriteString("\"")
	
	     buffer.WriteString(", \"Value\":")
	     // if it was a delete operation on given key, then we need to set the
	     //corresponding value null. Else, we will write the response.Value
	     //as-is (as the Value itself a JSON marble)
	     if response.IsDelete {
	         buffer.WriteString("null")
	     } else {
	         buffer.WriteString(string(response.Value))
	     }
	
	     buffer.WriteString(", \"Timestamp\":")
	     buffer.WriteString("\"")
	     buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
	     buffer.WriteString("\"")
	
	     buffer.WriteString(", \"IsDelete\":")
	     buffer.WriteString("\"")
	     buffer.WriteString(strconv.FormatBool(response.IsDelete))
	     buffer.WriteString("\"")
	
	     buffer.WriteString("}")
	     bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
	
	 fmt.Printf("- getComplaintHistory returning:\n%s\n", buffer.String())
	
	 return shim.Success(buffer.Bytes())
	}

// main function
func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
