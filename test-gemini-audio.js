/**
 * Test script to verify Gemini Live API audio capabilities
 * Run with: node test-gemini-audio.js
 */

import { GoogleGenAI } from "@google/genai";

// Get API key from environment
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY not found in environment");
  console.log("   On Replit, set it in Secrets (Tools > Secrets)");
  console.log("   Or run: GEMINI_API_KEY=your_key node test-gemini-audio.js");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

console.log("🧪 Testing Gemini Live API Audio Capabilities...\n");

// Test 1: Check if ai.live exists
console.log("1️⃣ Checking if Live API is available...");
if (!ai.live) {
  console.error("❌ ai.live is not available in this version of @google/genai");
  console.log("   You may need to upgrade: npm install @google/genai@latest");
  process.exit(1);
}
console.log("✅ Live API is available (@google/genai v1.27.0+)\n");

// Test 2: Try connecting with audio model
const modelToTest = "gemini-2.5-flash-native-audio-preview-09-2025";

console.log(`2️⃣ Testing model: ${modelToTest}\n`);

async function testAudioModel() {
  return new Promise((resolve, reject) => {
    let hasConnected = false;
    let hasReceivedResponse = false;
    let hasReceivedAudio = false;
    let hasReceivedText = false;
    let timeout;

    const callbacks = {
      onopen: function () {
        hasConnected = true;
        console.log("   ✅ WebSocket connection established!");
        console.log("   📤 Sending test message...\n");

        // Send a test message
        session.sendRealtimeInput({
          text: "Hello! Please say 'This is a test' so I can verify audio is working.",
        });

        // Set timeout for response
        timeout = setTimeout(() => {
          if (!hasReceivedResponse) {
            console.log("   ⏱️  Timeout: No response received in 15 seconds");
            session.close();
            resolve(false);
          }
        }, 15000);
      },

      onmessage: function (message) {
        console.log(`   📨 Message received:`, JSON.stringify(message, null, 2).substring(0, 500) + "...\n");

        hasReceivedResponse = true;

        // Check for server content with model turn
        if (message.serverContent?.modelTurn?.parts) {
          const parts = message.serverContent.modelTurn.parts;

          // Check for text transcript
          for (const part of parts) {
            if (part.text) {
              hasReceivedText = true;
              console.log(`   💬 TEXT TRANSCRIPT: "${part.text}"\n`);
            }

            if (part.inlineData?.mimeType?.includes("audio")) {
              hasReceivedAudio = true;
              const audioSize = part.inlineData.data.length;
              console.log(`   🔊 AUDIO DATA RECEIVED: ${audioSize} bytes (base64)\n`);
            }
          }
        }

        // Check if turn is complete
        if (message.serverContent?.turnComplete) {
          clearTimeout(timeout);
          console.log("   ✅ Turn complete!\n");

          console.log("📊 RESULTS:");
          console.log(`   - Connected: ${hasConnected ? "✅" : "❌"}`);
          console.log(`   - Received Text: ${hasReceivedText ? "✅" : "❌"}`);
          console.log(`   - Received Audio: ${hasReceivedAudio ? "✅" : "❌"}`);

          session.close();
          resolve(hasConnected && hasReceivedText && hasReceivedAudio);
        }
      },

      onerror: function (error) {
        console.error(`   ❌ Error:`, error.message || error);
        clearTimeout(timeout);
        reject(error);
      },

      onclose: function (event) {
        console.log(`   🔌 Connection closed: ${event.reason || "Normal closure"}\n`);
        clearTimeout(timeout);
      },
    };

    const config = {
      systemInstruction: "You are a helpful assistant. Keep responses very brief for testing purposes.",
      responseModalities: ["AUDIO"], // Request audio output
    };

    console.log("   🔌 Connecting to Gemini Live API...");

    const session = ai.live.connect({
      model: modelToTest,
      config: config,
      callbacks: callbacks,
    });
  });
}

// Run the test
try {
  const success = await testAudioModel();

  if (success) {
    console.log("\n🎉 SUCCESS! The Gemini audio model is working!\n");
    console.log("📋 IMPLEMENTATION NOTES:");
    console.log("   ✅ Model works: gemini-2.5-flash-native-audio-preview-09-2025");
    console.log("   ✅ You get BOTH text transcripts AND audio output");
    console.log("   ✅ Perfect for your interview app!");
    console.log("\n⚠️  IMPORTANT CONSIDERATIONS:");
    console.log("   - Audio format: 16-bit PCM, 16kHz mono (input), 24kHz (output)");
    console.log("   - Session limit: 15 minutes for audio-only sessions");
    console.log("   - Native audio models have LIMITED function/tool calling");
    console.log("   - You need to handle audio encoding/decoding in the browser");
    console.log("   - responseModalities can only be AUDIO or TEXT, not both");
    console.log("   - But you GET text transcripts even with AUDIO modality!");
  } else {
    console.log("\n❌ Test did not complete successfully");
    console.log("   Check the error messages above for details");
  }
} catch (error) {
  console.error("\n💥 Test failed with error:", error.message);
  console.log("\n🔍 Troubleshooting:");
  console.log("   1. Verify GEMINI_API_KEY is correct");
  console.log("   2. Check if your API key has access to the Live API");
  console.log("   3. Ensure you're on @google/genai v1.27.0 or higher");
  console.log("   4. Try: npm install @google/genai@latest");
}
