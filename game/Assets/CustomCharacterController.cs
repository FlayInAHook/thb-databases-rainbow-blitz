using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CustomCharacterController : MonoBehaviour
{

    public CharacterController controller;
    // Start is called before the first frame update

    public LayerMask groundMask; // Make sure to set this in the inspector to the layer your ground uses
    public bool isGrounded;

    public bool isAtEdge;

    private float capsuleRadius;
    public float groundCheckDistance = 1.0f;
    void Start()
    {
        controller = GetComponent<CharacterController>();
        capsuleRadius = controller.radius;
    }


    // Update is called once per frame
    void Update()
    {
        CheckIfFullyOffGround();
        isAtEdge = IsPlayerStandingAtEdge();
    }

    void CheckIfFullyOffGround() // check in 8 spots around the player if they are grounded
    {
        Vector3 bottom = transform.position - new Vector3(0, controller.height / 2, 0);
        Vector3 left = transform.position - new Vector3(controller.radius, controller.height / 2, 0);
        Vector3 right = transform.position - new Vector3(-controller.radius, controller.height / 2, 0);
        Vector3 front = transform.position - new Vector3(0, controller.height / 2, controller.radius);
        Vector3 back = transform.position - new Vector3(0, controller.height / 2, -controller.radius);
        Vector3 frontLeft = transform.position - new Vector3(controller.radius, controller.height / 2, controller.radius);
        Vector3 frontRight = transform.position - new Vector3(-controller.radius, controller.height / 2, controller.radius);
        Vector3 backLeft = transform.position - new Vector3(controller.radius, controller.height / 2, -controller.radius);
        Vector3 backRight = transform.position - new Vector3(-controller.radius, controller.height / 2, -controller.radius);

        if (Physics.Raycast(bottom, Vector3.down, groundCheckDistance, groundMask) ||
            Physics.Raycast(left, Vector3.down, groundCheckDistance, groundMask) ||
            Physics.Raycast(right, Vector3.down, groundCheckDistance, groundMask) ||
            Physics.Raycast(front, Vector3.down, groundCheckDistance, groundMask) ||
            Physics.Raycast(back, Vector3.down, groundCheckDistance, groundMask) ||
            Physics.Raycast(frontLeft, Vector3.down, groundCheckDistance, groundMask) ||
            Physics.Raycast(frontRight, Vector3.down, groundCheckDistance, groundMask) ||
            Physics.Raycast(backLeft, Vector3.down, groundCheckDistance, groundMask) ||
            Physics.Raycast(backRight, Vector3.down, groundCheckDistance, groundMask))
        {
            isGrounded = true;
        }
        else
        {
            isGrounded = false;
        }
    }

    bool IsPlayerStandingAtEdge() {

        Vector3 bottom = transform.position - new Vector3(0, controller.height / 2, 0);
        Vector3 left = transform.position - new Vector3(controller.radius, controller.height / 2, 0);
        Vector3 right = transform.position - new Vector3(-controller.radius, controller.height / 2, 0);
        Vector3 front = transform.position - new Vector3(0, controller.height / 2, controller.radius);
        Vector3 back = transform.position - new Vector3(0, controller.height / 2, -controller.radius);
        Vector3 frontLeft = transform.position - new Vector3(controller.radius, controller.height / 2, controller.radius);
        Vector3 frontRight = transform.position - new Vector3(-controller.radius, controller.height / 2, controller.radius);
        Vector3 backLeft = transform.position - new Vector3(controller.radius, controller.height / 2, -controller.radius);
        Vector3 backRight = transform.position - new Vector3(-controller.radius, controller.height / 2, -controller.radius);

        List<Vector3> positions = new List<Vector3> { bottom, left, right, front, back, frontLeft, frontRight, backLeft, backRight };

        foreach (Vector3 position in positions) {
            RaycastHit hit;
            if (Physics.Raycast(position, Vector3.down, out hit, 1f, groundMask)) {
                float angle = Vector3.Angle(hit.normal, Vector3.down);
                //Debug.Log("Angle: " + angle);
                if (angle > 170) {
                    return true;
                }
            }
        }
        return false;
    }

    void Move(Vector3 motion) { // replace the controller.Move() method with own implementation
        
        
    }
    

}
