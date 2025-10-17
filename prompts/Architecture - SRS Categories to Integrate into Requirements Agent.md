# Software Architecture 

## Business Priorities
* Competitive Advantage - Agility, Testability, Deployability, Scalability, Availability, Fault Tolerance
* Interoperatibility & Agility - Interoperability, scalability, adaptability, extensibility
* Time & Budget - Simplicity, Feasibility
* Time to Market - Agility, Testability, Deployability
* User Satisfaction - Agility, testability, deployability, scalability, availability, fault tolerance
* Regulatory or Legal Compliance - Testability, Deployability, Fault Tolerance, Interoperability, Security

## Priorities from Book - List A

Deployability
Elasticity
Evolutionary
Fault Tolerance
Modularity
Overall Cost
Performance
Reliability
Scalability
Simplicity
Testability

## Architecture Considerations - List B
Agility - missing
Testability - missing
Deployability - missing
Scalability
Availability
Fault Tolerance
Interoperability - Missing
Adaptability - Missing
Extensibility
Simplicity - Missing
Feasibility - Missing
Performance
Security

## “Table 4-1. Common operational architecture characteristics

Common - * Availability - How long the system will need to be available (if 24/7, steps need to be in place to allow the system to be up and running quickly in case of any failure).
Common - * Continuity - Disaster recovery capability.
Common - * Performance - Includes stress testing, peak analysis, analysis of the frequency of functions used, capacity required, and response times. Performance acceptance sometimes requires an exercise of its own, taking months to complete.
Common - * Recoverability - Business continuity requirements (e.g., in case of a disaster, how quickly is the system required to be on-line again?). This will affect the backup strategy and requirements for duplicated hardware.
Common - * Reliability/safety - Assess if the system needs to be fail-safe, or if it is mission critical in a way that affects lives. If it fails, will it cost the company large sums of money?
Common - * Robustness/Fault Tolerance - Ability to handle error and boundary conditions while running if the internet connection goes down or if there’s a power outage or hardware failure.
Common - * Scalability - Ability for the system to perform and operate as the number of users or requests increases.

## “Table 4-2. Structural architecture characteristics

Structural - Configurability - Ability for the end users to easily change aspects of the software’s configuration (through usable interfaces).
Structural - Extensibility - How important it is to plug new pieces of functionality in.
Structural - Installability - Ease of system installation on all necessary platforms.
Structural - Leverageability/reuse - Ability to leverage common components across multiple products.
Structural - Localization - Support for multiple languages on entry/query screens in data fields; on reports, multibyte character requirements and units of measure or currencies.
Structural - Maintainability - How easy it is to apply changes and enhance the system?
Structural - * Portability - Does the system need to run on more than one platform? (For example, does the frontend need to run against Oracle as well as SAP DB?
Structural - Supportability - What level of technical support is needed by the application? What level of logging and other facilities are required to debug errors in the system?
Structural - Upgradeability - Ability to easily/quickly upgrade from a previous version of this application/solution to a newer version on servers and clients.”

## “Table 4-3. Cross-cutting architecture characteristics

Cross - Accessibility - Access to all your users, including those with disabilities like colorblindness or hearing loss.
Cross - Archivability - Will the data need to be archived or deleted after a period of time? (For example, customer accounts are to be deleted after three months or marked as obsolete and archived to a secondary database for future access.)
Cross - Authentication - Security requirements to ensure users are who they say they are.
Cross - Authorization - Security requirements to ensure users can access only certain functions within the application (by use case, subsystem, webpage, business rule, field level, etc.).
Cross - Legal - What legislative constraints is the system operating in (data protection, Sarbanes Oxley, GDPR, etc.)? What reservation rights does the company require? Any regulations regarding the way the application is to be built or deployed?
Cross - Privacy - Ability to hide transactions from internal company employees (encrypted transactions so even DBAs and network architects cannot see them).
Cross - * Security - Does the data need to be encrypted in the database? Encrypted for network communication between internal systems? What type of authentication needs to be in place for remote user access?
Cross - Supportability - What level of technical support is needed by the application? What level of logging and other facilities are required to debug errors in the system?”
Cross - * Useablity/Achievability  - Level of training required for users to achieve their goals with the application/solution. Usability requirements need to be treated as seriously as any other architectural issue.



# ISO 25000

## Functional Suitability

This characteristic represents the degree to which a product or system provides functions that meet stated and implied needs when used under specified conditions. This characteristic is composed of the following sub-characteristics:

Suitability - * Functional completeness - Degree to which the set of functions covers all the specified tasks and user objectives.
Suitability - * Functional correctness - Degree to which a product or system provides the correct results with the needed degree of precision.
Suitability - * Functional appropriateness - Degree to which the functions facilitate the accomplishment of specified tasks and objectives.

## Performance efficiency

This characteristic represents the performance relative to the amount of resources used under stated conditions. This characteristic is composed of the following sub-characteristics:

Performance efficiency - * Time behaviour - Degree to which the response and processing times and throughput rates of a product or system, when performing its functions, meet requirements.
Performance efficiency - * Resource utilization - Degree to which the amounts and types of resources used by a product or system, when performing its functions, meet requirements.
Performance efficiency - * Capacity - Degree to which the maximum limits of a product or system parameter meet requirements.

## Compatibility

Degree to which a product, system or component can exchange information with other products, systems or components, and/or perform its required functions while sharing the same hardware or software environment. This characteristic is composed of the following sub-characteristics:

Compatibility - * Co-existence - Degree to which a product can perform its required functions efficiently while sharing a common environment and resources with other products, without detrimental impact on any other product.
Compatibility - * Interoperability - Degree to which two or more systems, products or components can exchange information and use the information that has been exchanged.

## Usability

Degree to which a product or system can be used by specified users to achieve specified goals with effectiveness, efficiency and satisfaction in a specified context of use. This characteristic is composed of the following sub-characteristics:

Usability - * Appropriateness recognizability - Degree to which users can recognize whether a product or system is appropriate for their needs.
Usability - * Learnability - Degree to which a product or system can be used by specified users to achieve specified goals of learning to use the product or system with effectiveness, efficiency, freedom from risk and satisfaction in a specified context of use.
Usability - * Operability - Degree to which a product or system has attributes that make it easy to operate and control.
Usability - * User error protection - Degree to which a system protects users against making errors.
Usability - * User interface aesthetics - Degree to which a user interface enables pleasing and satisfying interaction for the user.
Usability - * Accessibility - Degree to which a product or system can be used by people with the widest range of characteristics and capabilities to achieve a specified goal in a specified context of use.

## Reliability

Degree to which a system, product or component performs specified functions under specified conditions for a specified period of time. This characteristic is composed of the following sub-characteristics:

Reliability - * Maturity - Degree to which a system, product or component meets needs for reliability under normal operation.
Reliability - * Availability - Degree to which a system, product or component is operational and accessible when required for use.
Reliability - * Fault tolerance - Degree to which a system, product or component operates as intended despite the presence of hardware or software faults.
Reliability - * Recoverability - Degree to which, in the event of an interruption or a failure, a product or system can recover the data directly affected and re-establish the desired state of the system.

## Security

Degree to which a product or system protects information and data so that persons or other products or systems have the degree of data access appropriate to their types and levels of authorization. This characteristic is composed of the following sub-characteristics:

Security - * Confidentiality - Degree to which a product or system ensures that data are accessible only to those authorized to have access.
Security - * Integrity - Degree to which a system, product or component prevents unauthorized access to, or modification of, computer programs or data.
Security - * Non-repudiation - Degree to which actions or events can be proven to have taken place so that the events or actions cannot be repudiated later.
Security - * Accountability - Degree to which the actions of an entity can be traced uniquely to the entity.
Security - * Authenticity - Degree to which the identity of a subject or resource can be proved to be the one claimed.

## Maintainability

This characteristic represents the degree of effectiveness and efficiency with which a product or system can be modified to improve it, correct it or adapt it to changes in environment, and in requirements. This characteristic is composed of the following sub-characteristics:

Maintainability - * Modularity - Degree to which a system or computer program is composed of discrete components such that a change to one component has minimal impact on other components.
Maintainability - * Reusability - Degree to which an asset can be used in more than one system, or in building other assets.
Maintainability - * Analysability - Degree of effectiveness and efficiency with which it is possible to assess the impact on a product or system of an intended change to one or more of its parts, or to diagnose a product for deficiencies or causes of failures, or to identify parts to be modified.
Maintainability - * Modifiability - Degree to which a product or system can be effectively and efficiently modified without introducing defects or degrading existing product quality.
Maintainability - * Testability - Degree of effectiveness and efficiency with which test criteria can be established for a system, product or component and tests can be performed to determine whether those criteria have been met.

## Portability

Degree of effectiveness and efficiency with which a system, product or component can be transferred from one hardware, software or other operational or usage environment to another. This characteristic is composed of the following sub-characteristics:

Portability - * Adaptability - Degree to which a product or system can effectively and efficiently be adapted for different or evolving hardware, software or other operational or usage environments.
Portability - * Installability - Degree of effectiveness and efficiency with which a product or system can be successfully installed and/or uninstalled in a specified environment.
Portability - * Replaceability - Degree to which a product can replace another specified software product for the same purpose in the same environment.



# SRS Document from SCE

6.3.25.	User Requirements (UXT)
*

## Technology Architecture Considerations
6.3.4.	Business Rules Considerations (BRL)
6.3.16.	User Interface (UXI)
6.3.17.	Hardware Interfaces (HWI)
6.3.18.	Software Interfaces (SWI)
6.3.19.	Communications Interfaces (CMI)
6.3.20.	Data Requirements (DAT)
6.3.10.	Data Retention Considerations (DRT)
6.3.5.	Accuracy Considerations (ACC)
6.3.21.	Software/Service Functionality (SWF)
6.3.22.	Software/Service Characteristics (SWC)
6.3.23.	Infrastructure Functionality (IFF)
6.3.24.	Infrastructure characteristics (IFC)
6.3.27.	Other Requirements (OTH)
6.3.12.	Timing Considerations (TIM)
6.3.6.	Audit Trail Considerations (AUD)


6.3.7.	Scalability Considerations (SCL)
~6.3.11.	Operational Considerations (OPS)~
6.3.15.	Reliability Considerations (RLB)


## Operational Architecture Characteristics
6.3.8.	Availability Considerations (AVL) - Operational - Availability 
6.3.14.	Recoverability Considerations (RCR) - Operational - Continuity
6.3.9.	Capacity Considerations (CAP) - Operational - Performance
6.3.1.	Safety Considerations (SFT) - Operational - Reliability/Safety
6.3.3.	Software Quality Considerations (SWQ) - Operational - Robustness


## Structural Architecture Characteristics
6.3.13.	Portability Considerations (PRT) - Structural - Protability


## Cross-cutting Architecture Characteristics

6.3.2.	Security Considerations (SEC) - Cross-cutting - Security
6.3.26.	Usability Requirements (UST) - Cross-cutting - Useablity/Achievability
