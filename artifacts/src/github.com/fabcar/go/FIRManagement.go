// package main

// import (
//  "bytes"
//  "encoding/json"
//  "fmt"
//  "strconv"
//  "time"

//  "github.com/hyperledger/fabric-chaincode-go/shim"
//  sc "github.com/hyperledger/fabric-protos-go/peer"
 
// )

// // SmartContract structure
// type SmartContract struct {
// }

// // FIR structure
// type FIR struct {
//     ComplaintID    string          `json:"complaint_id"`
//     OfficerDetails OfficerDetails  `json:"officer_details"`
//     EvidenceHash   string          `json:"evidence_hash"`
//     FIRHash        string          `json:"fir_hash"`
//     DocumentDetails DocumentDetails `json:"document_details"`
//     History        []string        `json:"history"` 
// }


// // OfficerDetails structure
// type OfficerDetails struct {
// 	OfficerID       string `json:"officer_id"`
// 	PoliceStationID string `json:"police_station_id"`
// 	DateFrom        string `json:"date_from"`
// 	DateTo          string `json:"date_to"`
// }

// // DocumentDetails structure
// type DocumentDetails struct {
// 	DocumentID   string `json:"document_id"`
// 	DocumentName string `json:"document_name"`
// }

// // Init initializes the smart contract
// func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
// 	return shim.Success(nil)
// }

// // Invoke routes function calls to the appropriate method
// func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
// 	function, args := APIstub.GetFunctionAndParameters()

// 	switch function {
// 	case "addComplaint":
// 		return s.addComplaint(APIstub, args)
// 	case "updateDateToForOfficer":
// 		return s.updateDateToForOfficer(APIstub, args)
// 	case "changeOfficer":
// 		return s.changeOfficer(APIstub, args)
// 	case "updateEvidenceHash":
// 		return s.updateEvidenceHash(APIstub, args)
// 	case "getFIRHash":
// 		return s.getFIRHash(APIstub, args)
// 	case "getOfficerDetails":
// 		return s.getOfficerDetails(APIstub, args)
// 	case "getComplaintDetails":
// 		return s.getComplaintDetails(APIstub, args)
// 	case "getComplaintHistory":
// 		return s.getComplaintHistory(APIstub, args) 	
// 	default:
// 		return shim.Error("Invalid Smart Contract function name.")
// 	}
// }

// // addComplaint adds a new complaint to the ledger
// func (s *SmartContract) addComplaint(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 8 {
// 		return shim.Error("Incorrect number of arguments. Expecting 8.")
// 	}

// 	complaintID := args[0]
// 	officerID := args[1]
// 	policeStationID := args[2]
// 	evidenceHash := args[3]
// 	firHash := args[4]
// 	documentID := args[5]
// 	documentName := args[6]
// 	dateFrom := args[7]

// 	// Create OfficerDetails struct
// 	officerDetails := OfficerDetails{
// 		OfficerID:       officerID,
// 		PoliceStationID: policeStationID,
// 		DateFrom:        dateFrom,
// 		DateTo:          "", // Initially empty as the officer is currently handling the case
// 	}

// 	// Create DocumentDetails struct
// 	documentDetails := DocumentDetails{
// 		DocumentID:   documentID,
// 		DocumentName: documentName,
// 	}

// 	// Create the FIR struct
// 	fir := FIR{
// 		ComplaintID:    complaintID,
// 		OfficerDetails: officerDetails,
// 		EvidenceHash:   evidenceHash,
// 		FIRHash:        firHash,
// 		DocumentDetails: documentDetails,
// 	}

// 	// Convert FIR struct to JSON
// 	firAsBytes, err := json.Marshal(fir)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to marshal FIR: %s", err.Error()))
// 	}

// 	// Save FIR record to the ledger
// 	err = APIstub.PutState(complaintID, firAsBytes)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to add complaint: %s", err.Error()))
// 	}

// 	return shim.Success(nil)
// }


// // updateDateToForOfficer updates the DateTo for the current officer in the FIR record
// func (s *SmartContract) updateDateToForOfficer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 2 {
// 		return shim.Error("Incorrect number of arguments. Expecting 2.")
// 	}

// 	complaintID := args[0]
// 	dateTo := args[1]

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

// 	// Update the DateTo for the current officer
// 	fir.OfficerDetails.DateTo = dateTo

// 	// Marshal the updated FIR back to JSON
// 	firAsBytes, err = json.Marshal(fir)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
// 	}

// 	// Update FIR in the ledger
// 	err = APIstub.PutState(complaintID, firAsBytes)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to update DateTo for FIR %s: %s", complaintID, err.Error()))
// 	}

// 	// Return success response
// 	return shim.Success(nil)
// }


// // Function to change officer details
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

// 	// Assign new officer details
// 	fir.OfficerDetails.OfficerID = newOfficerID
// 	fir.OfficerDetails.PoliceStationID = newPoliceStationID
// 	fir.OfficerDetails.DateFrom = newDateFrom
// 	fir.OfficerDetails.DateTo = ""

// 	// Debug: Print new officer details
// 	fmt.Printf("New Officer Details: %+v\n", fir.OfficerDetails)

// 	// Marshal the updated FIR back to JSON
// 	firAsBytes, err = json.Marshal(fir)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
// 	}

// 	// Update FIR in the ledger (create a new transaction for the updated state)
// 	err = APIstub.PutState(complaintID, firAsBytes)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to change officer for FIR %s: %s", complaintID, err.Error()))
// 	}

// 	return shim.Success(nil)
// }



// // updateEvidenceHash adds new evidence (updates the EvidenceHash and DocumentDetails)
// func (s *SmartContract) updateEvidenceHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 4 {
// 		return shim.Error("Incorrect number of arguments. Expecting 4.")
// 	}

// 	complaintID := args[0]
// 	newEvidenceHash := args[1]
//     newDocumentID := args[2]
// 	newDocumentName := args[3]

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

// 	// Update the EvidenceHash and DocumentDetails
// 	fir.EvidenceHash = newEvidenceHash
// 	fir.DocumentDetails.DocumentID = newDocumentID
// 	fir.DocumentDetails.DocumentName = newDocumentName

// 	// Marshal the updated FIR back to JSON
// 	firAsBytes, err = json.Marshal(fir)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
// 	}

// 	// Update FIR in the ledger
// 	err = APIstub.PutState(complaintID, firAsBytes)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to add evidence for FIR %s: %s", complaintID, err.Error()))
// 	}

// 	return shim.Success(nil)
// }

// // getFIRHash retrieves the FIRHash using ComplaintID
// func (s *SmartContract) getFIRHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 1 {
// 		return shim.Error("Incorrect number of arguments. Expecting 1.")
// 	}

// 	complaintID := args[0]

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

// 	// Return the FIRHash
// 	return shim.Success([]byte(fir.FIRHash))
// }

// // getOfficerDetails retrieves the OfficerDetails using ComplaintID
// func (s *SmartContract) getOfficerDetails(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 1 {
// 		return shim.Error("Incorrect number of arguments. Expecting 1.")
// 	}

// 	complaintID := args[0]

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

// 	// Marshal OfficerDetails to JSON
// 	officerDetailsAsBytes, err := json.Marshal(fir.OfficerDetails)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to marshal OfficerDetails: %s", err.Error()))
// 	}

// 	return shim.Success(officerDetailsAsBytes)
// }

// // getComplaintDetails retrieves the full complaint details
// func (s *SmartContract) getComplaintDetails(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 1 {
// 		return shim.Error("Incorrect number of arguments. Expecting 1.")
// 	}

// 	complaintID := args[0]

// 	// Get the FIR record
// 	firAsBytes, err := APIstub.GetState(complaintID)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to get FIR: %s", err.Error()))
// 	} else if firAsBytes == nil {
// 		return shim.Error(fmt.Sprintf("FIR with ComplaintID %s not found.", complaintID))
// 	}

// 	// Return the FIR details
// 	return shim.Success(firAsBytes)
// }

// 	func (t *SmartContract) getComplaintHistory(stub shim.ChaincodeStubInterface, args []string) sc.Response {
// 		if len(args) != 1 || args[0] == "" {
// 			return shim.Error("Incorrect number of arguments. Expecting 1, and the complaint ID cannot be empty.")
// 		}
	
// 		complaintID := args[0]
	
// 		// Get the history for the complaintID
// 		resultsIterator, err := stub.GetHistoryForKey(complaintID)
// 		if err != nil {
// 			return shim.Error(err.Error())
// 		}
// 		defer resultsIterator.Close()
	
// 		var buffer bytes.Buffer
// 		buffer.WriteString("[")
	
// 		bArrayMemberAlreadyWritten := false
// 		for resultsIterator.HasNext() {
// 			response, err := resultsIterator.Next()
// 			if err != nil {
// 				return shim.Error(err.Error())
// 			}
	
// 			if bArrayMemberAlreadyWritten {
// 				buffer.WriteString(",")
// 			}
	
// 			buffer.WriteString("{\"TxId\":\"")
// 			buffer.WriteString(response.TxId)
// 			buffer.WriteString("\", \"Value\":")
			
// 			if response.IsDelete {
// 				buffer.WriteString("null")
// 			} else {
// 				buffer.WriteString(string(response.Value))
// 			}
	
// 			buffer.WriteString(", \"Timestamp\":\"")
// 			buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
// 			buffer.WriteString("\", \"IsDelete\":\"")
// 			buffer.WriteString(strconv.FormatBool(response.IsDelete))
// 			buffer.WriteString("\"}")
	
// 			bArrayMemberAlreadyWritten = true
// 		}
// 		buffer.WriteString("]")
	
// 		fmt.Printf("- getComplaintHistory returning:\n%s\n", buffer.String())
	
// 		return shim.Success(buffer.Bytes())
// 	}
	

// // main function
// func main() {
// 	err := shim.Start(new(SmartContract))
// 	if err != nil {
// 		fmt.Printf("Error creating new Smart Contract: %s", err)
// 	}
// }


package main

import (
	
	"encoding/json"
	"fmt"
	
	"time"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	sc "github.com/hyperledger/fabric-protos-go/peer"
)

// SmartContract structure
type SmartContract struct{}

// FIR structure
type FIR struct {
	ComplaintID    string         `json:"complaint_id"`
	PartialFIRHash string         `json:"partial_fir_hash"`
	FolderHash     string         `json:"folder_hash"`
	FIRHash        string         `json:"fir_hash"`
	OfficerDetails OfficerDetails `json:"officer_details"`
}

// OfficerDetails structure
type OfficerDetails struct {
	OfficerID       string `json:"officer_id"`
	PoliceStationID string `json:"police_station_id"`
	DateFrom        string `json:"date_from"`
	DateTo          string `json:"date_to"`
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
	case "addOfficerDetails":
		return s.addOfficerDetails(APIstub, args)
	case "addFIRHash":
		return s.addFIRHash(APIstub, args)
	case "updateFolderHash":
		return s.updateFolderHash(APIstub, args)
	case "updateDateToForOfficer":
		return s.updateDateToForOfficer(APIstub, args)	
	case "changeOfficer":
		return s.changeOfficer(APIstub, args)
	case "getPartialFIRHash":
		return s.getPartialFIRHash(APIstub, args)
	case "getFolderHash":
		return s.getFolderHash(APIstub, args)
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

// Helper to get the current timestamp in string format
func getCurrentTimestamp() string {
	return time.Now().Format("2006-01-02 15:04:05")
}

// Stage 1: Add a new complaint
func (s *SmartContract) addComplaint(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Invalid number of arguments. Expected 3 arguments: ComplaintID, PartialFIRHash, and FolderHash.")
	}

	complaintID := args[0]
	partialFIRHash := args[1]
	folderHash := args[2]

	if complaintID == "" {
		return shim.Error("ComplaintID cannot be empty.")
	}
	if partialFIRHash == "" {
		return shim.Error("PartialFIRHash cannot be empty.")
	}
	if folderHash == "" {
		return shim.Error("FolderHash cannot be empty.")
	}

	// Create the FIR object
	fir := FIR{
		ComplaintID:    complaintID,
		PartialFIRHash: partialFIRHash,
		FolderHash:     folderHash,
	}

	firAsBytes, err := json.Marshal(fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal FIR object: %s", err.Error()))
	}

	err = APIstub.PutState(complaintID, firAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to store FIR in the ledger: %s", err.Error()))
	}

	return shim.Success([]byte(fmt.Sprintf("Complaint with ID '%s' has been successfully added.", complaintID)))
}

//Can't add complaint with already existing ID

// func (s *SmartContract) addComplaint(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 3 {
// 		return shim.Error("Invalid number of arguments. Expected 3 arguments: ComplaintID, PartialFIRHash, and FolderHash.")
// 	}

// 	complaintID := args[0]
// 	partialFIRHash := args[1]
// 	folderHash := args[2]

// 	if complaintID == "" {
// 		return shim.Error("ComplaintID cannot be empty.")
// 	}
// 	if partialFIRHash == "" {
// 		return shim.Error("PartialFIRHash cannot be empty.")
// 	}
// 	if folderHash == "" {
// 		return shim.Error("FolderHash cannot be empty.")
// 	}

// 	// Check if the complaint already exists
// 	existingComplaintAsBytes, err := APIstub.GetState(complaintID)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to check existing complaint: %s", err.Error()))
// 	}
// 	if existingComplaintAsBytes != nil {
// 		return shim.Error(fmt.Sprintf("Complaint with ID '%s' already exists.", complaintID))
// 	}

// 	// Create the FIR object
// 	fir := FIR{
// 		ComplaintID:    complaintID,
// 		PartialFIRHash: partialFIRHash,
// 		FolderHash:     folderHash,
// 	}

// 	firAsBytes, err := json.Marshal(fir)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to marshal FIR object: %s", err.Error()))
// 	}

// 	// Store the FIR in the ledger
// 	err = APIstub.PutState(complaintID, firAsBytes)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to store FIR in the ledger: %s", err.Error()))
// 	}

// 	return shim.Success([]byte(fmt.Sprintf("Complaint with ID '%s' has been successfully added.", complaintID)))
// }


// Stage 2: Add officer details
func (s *SmartContract) addOfficerDetails(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3: ComplaintID, OfficerID, PoliceStationID.")
	}

	complaintID := args[0]
	officerID := args[1]
	policeStationID := args[2]

	// Get FIR from the ledger
	firAsBytes, err := APIstub.GetState(complaintID)
	if err != nil || firAsBytes == nil {
		return shim.Error(fmt.Sprintf("FIR with ComplaintID %s not found.", complaintID))
	}

	// Unmarshal FIR
	var fir FIR
	err = json.Unmarshal(firAsBytes, &fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal FIR: %s", err.Error()))
	}

	// Add officer details
	fir.OfficerDetails = OfficerDetails{
		OfficerID:       officerID,
		PoliceStationID: policeStationID,
		DateFrom:        getCurrentTimestamp(),
		DateTo:          "",
	}

	// Update FIR on the ledger
	firAsBytes, err = json.Marshal(fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
	}

	err = APIstub.PutState(complaintID, firAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to add officer details: %s", err.Error()))
	}

	return shim.Success(nil)
}

// func (s *SmartContract) addOfficerDetails(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 3 {
// 		return shim.Error("Invalid number of arguments. Expected 3 arguments: ComplaintID, OfficerID, and OfficerName.")
// 	}

// 	complaintID := args[0]
// 	officerID := args[1]
// 	officerName := args[2]

// 	if complaintID == "" {
// 		return shim.Error("ComplaintID cannot be empty.")
// 	}
// 	if officerID == "" {
// 		return shim.Error("OfficerID cannot be empty.")
// 	}
// 	if officerName == "" {
// 		return shim.Error("OfficerName cannot be empty.")
// 	}

// 	// Fetch existing FIR
// 	firAsBytes, err := APIstub.GetState(complaintID)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to retrieve FIR with ComplaintID '%s': %s", complaintID, err.Error()))
// 	}
// 	if firAsBytes == nil {
// 		return shim.Error(fmt.Sprintf("FIR with ComplaintID '%s' does not exist.", complaintID))
// 	}

// 	var fir FIR
// 	err = json.Unmarshal(firAsBytes, &fir)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to unmarshal FIR: %s", err.Error()))
// 	}

// 	// Update officer details
// 	fir.OfficerDetails = OfficerDetails{
// 		OfficerID:   officerID,
// 		OfficerName: officerName,
// 		DateFrom:    time.Now().Format("2006-01-02 15:04:05"),
// 	}

// 	firAsBytes, err = json.Marshal(fir)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
// 	}

// 	err = APIstub.PutState(complaintID, firAsBytes)
// 	if err != nil {
// 		return shim.Error(fmt.Sprintf("Failed to update FIR in the ledger: %s", err.Error()))
// 	}

// 	return shim.Success([]byte(fmt.Sprintf("Officer details have been successfully added for ComplaintID '%s'.", complaintID)))
// }


// Stage 3: Add FIRHash and update folderHash
func (s *SmartContract) addFIRHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3: ComplaintID, FIRHash, FolderHash.")
	}

	complaintID := args[0]
	firHash := args[1]
	folderHash := args[2]

	// Get FIR from the ledger
	firAsBytes, err := APIstub.GetState(complaintID)
	if err != nil || firAsBytes == nil {
		return shim.Error(fmt.Sprintf("FIR with ComplaintID %s not found.", complaintID))
	}

	// Unmarshal FIR
	var fir FIR
	err = json.Unmarshal(firAsBytes, &fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal FIR: %s", err.Error()))
	}

	// Update FIRHash and FolderHash
	fir.FIRHash = firHash
	fir.FolderHash = folderHash

	// Update FIR on the ledger
	firAsBytes, err = json.Marshal(fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
	}

	err = APIstub.PutState(complaintID, firAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to add FIRHash: %s", err.Error()))
	}

	return shim.Success(nil)
}

// Update folderHash for evidence updates
func (s *SmartContract) updateFolderHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2: ComplaintID, FolderHash.")
	}

	complaintID := args[0]
	newFolderHash := args[1]

	// Get FIR from the ledger
	firAsBytes, err := APIstub.GetState(complaintID)
	if err != nil || firAsBytes == nil {
		return shim.Error(fmt.Sprintf("FIR with ComplaintID %s not found.", complaintID))
	}

	// Unmarshal FIR
	var fir FIR
	err = json.Unmarshal(firAsBytes, &fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal FIR: %s", err.Error()))
	}

	// Update FolderHash
	fir.FolderHash = newFolderHash

	// Update FIR on the ledger
	firAsBytes, err = json.Marshal(fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
	}

	err = APIstub.PutState(complaintID, firAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to update FolderHash: %s", err.Error()))
	}

	return shim.Success(nil)
}

// updateDateToForOfficer updates the DateTo for the current officer in the FIR record
func (s *SmartContract) updateDateToForOfficer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1 (ComplaintID).")
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

	// Update the DateTo for the current officer with the current timestamp
	fir.OfficerDetails.DateTo = getCurrentTimestamp()

	// Marshal the updated FIR back to JSON
	firAsBytes, err = json.Marshal(fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
	}

	// Update FIR in the ledger
	err = APIstub.PutState(complaintID, firAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to update DateTo for FIR %s: %s", complaintID, err.Error()))
	}

	// Return success response
	return shim.Success(nil)
}

// Function to change officer details
func (s *SmartContract) changeOfficer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3.")
	}

	complaintID := args[0]
	newOfficerID := args[1]
	newPoliceStationID := args[2]

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

	// Assign new officer details
	fir.OfficerDetails.OfficerID = newOfficerID
	fir.OfficerDetails.PoliceStationID = newPoliceStationID
	fir.OfficerDetails.DateFrom = getCurrentTimestamp()
	fir.OfficerDetails.DateTo = ""

	// Debug: Print new officer details
	fmt.Printf("New Officer Details: %+v\n", fir.OfficerDetails)

	// Marshal the updated FIR back to JSON
	firAsBytes, err = json.Marshal(fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal updated FIR: %s", err.Error()))
	}

	// Update FIR in the ledger (create a new transaction for the updated state)
	err = APIstub.PutState(complaintID, firAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change officer for FIR %s: %s", complaintID, err.Error()))
	}

	return shim.Success(nil)
}

// Get methods
func (s *SmartContract) getPartialFIRHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	return s.getField(APIstub, args, "partialFIRHash")
}

func (s *SmartContract) getFolderHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	return s.getField(APIstub, args, "folderHash")
}

func (s *SmartContract) getFIRHash(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	return s.getField(APIstub, args, "firHash")
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

// Helper to retrieve a specific field from FIR
func (s *SmartContract) getField(APIstub shim.ChaincodeStubInterface, args []string, field string) sc.Response {
	if len(args) != 1 {
		return shim.Error(fmt.Sprintf("Incorrect number of arguments. Expecting 1: ComplaintID to retrieve %s.", field))
	}

	complaintID := args[0]
	firAsBytes, err := APIstub.GetState(complaintID)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to retrieve %s for ComplaintID %s: %s", field, complaintID, err.Error()))
	}

	var fir FIR
	err = json.Unmarshal(firAsBytes, &fir)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal FIR: %s", err.Error()))
	}

	var result []byte
	switch field {
	case "partialFIRHash":
		result, err = json.Marshal(fir.PartialFIRHash)
	case "folderHash":
		result, err = json.Marshal(fir.FolderHash)
	case "firHash":
		result, err = json.Marshal(fir.FIRHash)
	}
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal %s: %s", field, err.Error()))
	}

	return shim.Success(result)
}

// func (t *SmartContract) getComplaintHistory(stub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 1 || args[0] == "" {
// 		return shim.Error("Incorrect number of arguments. Expecting 1, and the complaint ID cannot be empty.")
// 	}

// 	complaintID := args[0]

// 	// Get the history for the complaintID
// 	resultsIterator, err := stub.GetHistoryForKey(complaintID)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}
// 	defer resultsIterator.Close()

// 	var buffer bytes.Buffer
// 	buffer.WriteString("[")

// 	bArrayMemberAlreadyWritten := false
// 	for resultsIterator.HasNext() {
// 		response, err := resultsIterator.Next()
// 		if err != nil {
// 			return shim.Error(err.Error())
// 		}

// 		if bArrayMemberAlreadyWritten {
// 			buffer.WriteString(",")
// 		}

// 		buffer.WriteString("{\"TxId\":\"")
// 		buffer.WriteString(response.TxId)
// 		buffer.WriteString("\", \"Value\":")
		
// 		if response.IsDelete {
// 			buffer.WriteString("null")
// 		} else {
// 			buffer.WriteString(string(response.Value))
// 		}

// 		buffer.WriteString(", \"Timestamp\":\"")
// 		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
// 		buffer.WriteString("\", \"IsDelete\":\"")
// 		buffer.WriteString(strconv.FormatBool(response.IsDelete))
// 		buffer.WriteString("\"}")

// 		bArrayMemberAlreadyWritten = true
// 	}
// 	buffer.WriteString("]")

// 	fmt.Printf("- getComplaintHistory returning:\n%s\n", buffer.String())

// 	return shim.Success(buffer.Bytes())
// }

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


func (s *SmartContract) getComplaintHistory(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Invalid number of arguments. Expected 1 argument: ComplaintID.")
	}

	complaintID := args[0]
	if complaintID == "" {
		return shim.Error("ComplaintID cannot be empty.")
	}

	resultsIterator, err := APIstub.GetHistoryForKey(complaintID)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to retrieve history for ComplaintID '%s': %s", complaintID, err.Error()))
	}
	defer resultsIterator.Close()

	// Initialize history array
	var history []map[string]interface{}

	// Loop through the iterator
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(fmt.Sprintf("Error reading history for ComplaintID '%s': %s", complaintID, err.Error()))
		}

		// Append each transaction's details
		record := map[string]interface{}{
			"TxId":      response.TxId,
			"Value":     string(response.Value),
			"Timestamp": time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String(),
			"IsDelete":  response.IsDelete,
		}
		history = append(history, record)
	}

	// Check if no history was found
	if len(history) == 0 {
		return shim.Success([]byte(fmt.Sprintf("No history exists for ComplaintID '%s'.", complaintID)))
	}

	// Marshal the history into JSON
	historyAsBytes, err := json.Marshal(history)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal history data: %s", err.Error()))
	}

	return shim.Success(historyAsBytes)
}


func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating SmartContract: %s", err.Error())
	}
}
