<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST' && !empty($_POST['title'])) {//check the request is post and the input title is given
    $courseTitle = $_POST['title'];
    $apiKey = 'AIzaSyCbYUH1vH1Vus3c8xREe2abB9JjzD-GpWk'; // Replace with your actual API key

    // Prompts for each section
    $prompts = [
        'shortDesc' => "Write a very short concise description in 60 words for the course titled (Don't apply bolding any text): '$courseTitle'.",
        'outcomes' => "List the learning outcomes in 7 point by point for the course titled (Don't apply bolding any text): '$courseTitle'.",
        'requirements' => "Specify the prerequisites exactly in 70 or requirements for enrolling in the course titled (Don't apply bolding any text or add any other unwanted texts): '$courseTitle'.",
        'courseDesc' => "Provide a detailed course description in 200 words for the course titled (Don't apply bolding or add any other unwanted texts like title): '$courseTitle'."
    ];

    // Results array
    $results = [
        'shortDesc' => '',
        'outcomes' => '',
        'requirements' => '',
        'courseDesc' => ''
    ];

    // Base API URL
    $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    foreach ($prompts as $key => $prompt) {
        // Data payload for the POST request
        $postData = json_encode([//convert to json to send to gemini api
            'contents' => [//its a format of payload...data payload means the  data sending
                'parts' => [
                    ['text' => $prompt]
                ]
            ]
        ]);

        // Initialize a cURL session:Curl is the client url library that interact with gemini api
        $ch = curl_init("$baseUrl?key=$apiKey");

        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

        // Execute the cURL session and capture the response
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        // Check for cURL errors
        if (curl_errno($ch)) {
            curl_close($ch);
            http_response_code(500);
            echo json_encode(['error' => 'cURL error: ' . curl_error($ch)]);
            exit;
        } else if ($httpCode != 200) {
            curl_close($ch);
            http_response_code($httpCode);
            echo json_encode(['error' => 'HTTP error occurred: ' . $httpCode]);
            exit;
        }

        // Decode the response
        $responseData = json_decode($response, true);

        // Check if the response contains the expected content
        if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
            $results[$key] = $responseData['candidates'][0]['content']['parts'][0]['text'];
        }

        // Close the cURL session
        curl_close($ch);
    }

    // Return the results as JSON
    echo json_encode($results);

} else {
    http_response_code(400);
    echo json_encode(['error' => 'No course title provided']);
}

?>
