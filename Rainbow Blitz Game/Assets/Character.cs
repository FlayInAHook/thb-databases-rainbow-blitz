using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Character : MonoBehaviour
{
    // implement jumping gravity and moving 
    private CharacterController controller;

    public float speed = 12f;
    public float gravity = -9.81f;
    public float jumpHeight = 3f;


    public float groundDistance = 0.4f;

    public LayerMask groundMask;

    public Vector3 velocity;

    void Start()
    {
        controller = GetComponent<CharacterController>();
        velocity = new Vector3(0, 0, 0);
    }

    void Update()
    {

        if (controller.isGrounded && velocity.y < 0)
        {
            velocity.y = -2f;
        }

        // get the input from the player
        float x = Input.GetAxis("Horizontal");
        float z = Input.GetAxis("Vertical");

        // move the player
        Vector3 move = transform.right * x + transform.forward * z;

        controller.Move(move * speed * Time.deltaTime);

        if (Input.GetButtonDown("Jump"))
        {
            Debug.Log("Jumping");
        }

        // implement jumping
        if (Input.GetButtonDown("Jump") && controller.isGrounded)
        {
            velocity.y = Mathf.Sqrt(jumpHeight * -2f * gravity);
            // log to the console
            Debug.Log("Jumping");
        }

        // implement gravity
        velocity.y += gravity * Time.deltaTime;

        controller.Move(velocity * Time.deltaTime);
    }

}
