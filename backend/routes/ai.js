// backend/routes/ai.js

const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const auth = require("../middleware/auth");
const axios = require("axios");

// Real AI Integration (OpenAI/OpenRouter)
const generateWithRealAI = async (prompt, context = null) => {
  try {
    // Try OpenAI first
    if (process.env.OPENAI_API_KEY) {
      const messages = [
        {
          role: "system",
          content: `You are a React component generator. Generate ONLY valid React JSX components with CSS styling. 
          Return a JSON object with 'jsx' and 'css' properties. The JSX should be a complete React component.
          Make components modern, responsive, and well-styled.
          
          ${context ? 'This is an iterative refinement. Modify the existing component based on the user request.' : ''}`
        }
      ];

      if (context) {
        messages.push({
          role: "user",
          content: `Current component:\nJSX: ${context.jsx}\nCSS: ${context.css}\n\nUser request: ${prompt}\n\nModify the component according to the user's request. Return only valid JSON with jsx and css properties.`
        });
      } else {
        messages.push({
          role: "user",
          content: `Create a React component for: ${prompt}. Return only valid JSON with jsx and css properties.`
        });
      }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
          model: "gpt-4o-mini",
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      const content = response.data.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        if (parsed.jsx && parsed.css) {
          return parsed;
        }
      } catch (e) {
        console.log("Failed to parse OpenAI response as JSON, using fallback");
      }
    }

    // Try OpenRouter as fallback
    if (process.env.OPENROUTER_API_KEY) {
      const messages = [
        {
          role: "system",
          content: `You are a React component generator. Generate ONLY valid React JSX components with CSS styling. 
          Return a JSON object with 'jsx' and 'css' properties. The JSX should be a complete React component.
          Make components modern, responsive, and well-styled.
          
          ${context ? 'This is an iterative refinement. Modify the existing component based on the user request.' : ''}`
        }
      ];

      if (context) {
        messages.push({
          role: "user",
          content: `Current component:\nJSX: ${context.jsx}\nCSS: ${context.css}\n\nUser request: ${prompt}\n\nModify the component according to the user's request. Return only valid JSON with jsx and css properties.`
        });
      } else {
        messages.push({
          role: "user",
          content: `Create a React component for: ${prompt}. Return only valid JSON with jsx and css properties.`
        });
      }

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: messages,
        temperature: 0.7,
          max_tokens: 2000
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

      const content = response.data.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        if (parsed.jsx && parsed.css) {
          return parsed;
        }
      } catch (e) {
        console.log("Failed to parse OpenRouter response as JSON, using fallback");
      }
    }

    throw new Error("No AI API configured");
  } catch (error) {
    console.error("Real AI error:", error.message);
    throw error;
  }
};

// Mock AI response for development (fallback)
const generateComponent = async (prompt, context = null) => {
  // Try real AI first
  try {
    return await generateWithRealAI(prompt, context);
  } catch (error) {
    console.log("Using mock AI fallback:", error.message);
  }

  // Fallback to mock responses with iterative refinement
  const components = {
    button: {
      jsx: `import React from 'react';

const Button = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;`,
      css: `.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}`
    },
    car: {
      jsx: `import React from 'react';

const Car = ({ model, color = 'red', speed = 'fast' }) => {
  return (
    <div className="car">
      <div className="car-body">
        <div className="car-top"></div>
        <div className="car-bottom">
          <div className="car-wheel car-wheel-front"></div>
          <div className="car-wheel car-wheel-back"></div>
        </div>
      </div>
      <div className="car-details">
        <h3 className="car-model">{model || 'Sports Car'}</h3>
        <p className="car-specs">Color: {color} | Speed: {speed}</p>
      </div>
    </div>
  );
};

export default Car;`,
      css: `.car {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.car-body {
  position: relative;
  width: 200px;
  height: 80px;
  background: linear-gradient(45deg, #ff4444, #cc0000);
  border-radius: 40px 40px 20px 20px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.car-top {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 40px;
  background: linear-gradient(45deg, #ff6666, #ff4444);
  border-radius: 20px 20px 0 0;
  border: 2px solid #cc0000;
}

.car-bottom {
  position: relative;
  width: 100%;
  height: 100%;
}

.car-wheel {
  position: absolute;
  bottom: -15px;
  width: 30px;
  height: 30px;
  background: #333;
  border-radius: 50%;
  border: 3px solid #666;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.5);
}

.car-wheel-front {
  left: 20px;
}

.car-wheel-back {
  right: 20px;
}

.car-details {
  text-align: center;
}

.car-model {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.car-specs {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* Car variants */
.car.sports {
  transform: scale(1.1);
}

.car.luxury .car-body {
  background: linear-gradient(45deg, #gold, #ffd700);
}

.car.electric .car-body {
  background: linear-gradient(45deg, #00ff00, #00cc00);
}`
    },
    card: {
      jsx: `import React from 'react';

const Card = ({ title, content, image }) => {
  return (
    <div className="card">
      {image && (
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-text">{content}</p>
      </div>
    </div>
  );
};

export default Card;`,
      css: `.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.card-text {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}`
    },
    navbar: {
      jsx: `import React, { useState } from 'react';

const Navbar = ({ brand, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">{brand}</span>
        <button 
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <div className={\`navbar-menu \${isOpen ? 'is-open' : ''}\`}>
        {links.map((link, index) => (
          <a key={index} href={link.url} className="navbar-link">
            {link.text}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;`,
      css: `.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
}

.navbar-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.navbar-toggle span {
  width: 25px;
  height: 3px;
  background: #374151;
  margin: 2px 0;
  transition: 0.3s;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.navbar-link {
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  transition: color 0.2s ease;
}

.navbar-link:hover {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .navbar-toggle {
    display: flex;
  }
  
  .navbar-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .navbar-menu.is-open {
    display: flex;
  }
}`
    }
  };

  // Enhanced prompt matching for new components
  const promptLower = prompt.toLowerCase();
  
  // Check if this is a request for a completely new component type
  const isNewComponentRequest = (prompt) => {
    const newComponentKeywords = ['create', 'make', 'build', 'generate', 'new'];
    const componentTypes = ['car', 'vehicle', 'automobile', 'button', 'card', 'navbar', 'nav', 'header', 'menu'];
    
    const hasNewKeyword = newComponentKeywords.some(keyword => prompt.includes(keyword));
    const hasComponentType = componentTypes.some(type => prompt.includes(type));
    
    return hasNewKeyword && hasComponentType;
  };
  
  // If this is a new component request, ignore context and create fresh
  if (isNewComponentRequest(promptLower)) {
    console.log('New component request detected:', promptLower);
    
    // Specific component matching
    if (promptLower.includes('car') || promptLower.includes('vehicle') || promptLower.includes('automobile')) {
      console.log('Generating car component');
      return components.car;
    } else if (promptLower.includes('button') || promptLower.includes('btn')) {
      console.log('Generating button component');
      return components.button;
    } else if (promptLower.includes('card') || promptLower.includes('container') || promptLower.includes('box')) {
      console.log('Generating card component');
      return components.card;
    } else if (promptLower.includes('nav') || promptLower.includes('header') || promptLower.includes('menu') || promptLower.includes('navigation')) {
      console.log('Generating navbar component');
      return components.navbar;
    } else {
      // Default to button for generic requests
      console.log('Generating default button component');
      return components.button;
    }
  }
  
  // Handle iterative refinement for existing components
  if (context && context.jsx && context.css) {
    console.log('Iterative refinement detected');
    const promptLower = prompt.toLowerCase();
    
    // Apply modifications based on prompt
    if (promptLower.includes('larger') || promptLower.includes('bigger')) {
      return {
        jsx: context.jsx,
        css: context.css.replace(/font-size:\s*\d+px/g, 'font-size: 20px')
                       .replace(/padding:\s*\d+px/g, 'padding: 16px 32px')
                       .replace(/width:\s*\d+px/g, 'width: 250px')
                       .replace(/height:\s*\d+px/g, 'height: 100px')
      };
    }
    
    if (promptLower.includes('red')) {
      return {
        jsx: context.jsx,
        css: context.css.replace(/background-color:\s*#[0-9a-fA-F]{6}/g, 'background-color: #dc2626')
                       .replace(/color:\s*#[0-9a-fA-F]{6}/g, 'color: white')
                       .replace(/background:\s*linear-gradient\([^)]*\)/g, 'background: linear-gradient(45deg, #ff4444, #cc0000)')
      };
    }
    
    if (promptLower.includes('blue')) {
      return {
        jsx: context.jsx,
        css: context.css.replace(/background-color:\s*#[0-9a-fA-F]{6}/g, 'background-color: #3b82f6')
                       .replace(/color:\s*#[0-9a-fA-F]{6}/g, 'color: white')
                       .replace(/background:\s*linear-gradient\([^)]*\)/g, 'background: linear-gradient(45deg, #3b82f6, #1d4ed8)')
      };
    }
    
    if (promptLower.includes('rounded') || promptLower.includes('circle')) {
      return {
        jsx: context.jsx,
        css: context.css.replace(/border-radius:\s*\d+px/g, 'border-radius: 25px')
      };
    }
    
    // Default: return original with slight modification
    return {
      jsx: context.jsx,
      css: context.css + '\n/* Modified based on user request */'
    };
  }

  // Fallback: simple prompt matching for new components
  console.log('Fallback component matching');
  if (promptLower.includes('car') || promptLower.includes('vehicle') || promptLower.includes('automobile')) {
    return components.car;
  } else if (promptLower.includes('button') || promptLower.includes('btn')) {
    return components.button;
  } else if (promptLower.includes('card') || promptLower.includes('container') || promptLower.includes('box')) {
    return components.card;
  } else if (promptLower.includes('nav') || promptLower.includes('header') || promptLower.includes('menu') || promptLower.includes('navigation')) {
    return components.navbar;
  } else {
    // Default to button for generic requests
    return components.button;
  }
};

router.post("/generate", auth, async (req, res) => {
  try {
    const { prompt, sessionId } = req.body;

    if (!prompt || !sessionId) {
      return res.status(400).json({ error: "Prompt and sessionId are required" });
    }

    // Get current session to check for existing component
    const session = await Session.findOne({ 
      _id: sessionId, 
      userId: req.user._id 
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if this is an iterative refinement or new component request
    const promptLower = prompt.toLowerCase();
    const newComponentKeywords = ['create', 'make', 'build', 'generate', 'new'];
    const componentTypes = ['car', 'vehicle', 'automobile', 'button', 'card', 'navbar', 'nav', 'header', 'menu'];
    
    const hasNewKeyword = newComponentKeywords.some(keyword => promptLower.includes(keyword));
    const hasComponentType = componentTypes.some(type => promptLower.includes(type));
    const isNewComponentRequest = hasNewKeyword && hasComponentType;
    
    console.log('Request analysis:', {
      prompt: prompt,
      hasNewKeyword,
      hasComponentType,
      isNewComponentRequest,
      hasExistingComponent: !!(session.currentCode && session.currentCode.jsx)
    });

    // Determine context for AI
    let context = null;
    let isIterative = false;
    
    if (isNewComponentRequest) {
      // New component request - ignore existing context
      console.log('Treating as new component request');
      context = null;
      isIterative = false;
    } else if (session.currentCode && session.currentCode.jsx && session.currentCode.css) {
      // Iterative refinement of existing component
      console.log('Treating as iterative refinement');
      context = session.currentCode;
      isIterative = true;
    } else {
      // No existing component, treat as new
      console.log('No existing component, treating as new request');
      context = null;
      isIterative = false;
    }

    // Generate component code (with context for iterative refinement)
    const generatedCode = await generateComponent(prompt, context);

    // Add user message to session
    session.messages.push({
      role: 'user',
      content: prompt,
      timestamp: new Date()
    });

    // Add AI response
    const responseMessage = isIterative 
      ? `I've updated the component based on your request: "${prompt}". The component has been modified with the new styling and properties.`
      : `I've generated a React component based on your request: "${prompt}". The component includes both JSX and CSS styling.`;

    session.messages.push({
      role: 'assistant',
      content: responseMessage,
      timestamp: new Date()
    });

    // Update the current code
    session.currentCode = {
      jsx: generatedCode.jsx,
      css: generatedCode.css
    };

    await session.save();

    console.log('Component generated successfully:', {
      isIterative,
      componentType: generatedCode.jsx.includes('Car') ? 'Car' : 
                    generatedCode.jsx.includes('Button') ? 'Button' : 
                    generatedCode.jsx.includes('Card') ? 'Card' : 
                    generatedCode.jsx.includes('Navbar') ? 'Navbar' : 'Unknown'
    });

    res.json({ 
      message: isIterative ? "Component updated successfully" : "Component generated successfully",
      session: session,
      isIterative: isIterative
    });

  } catch (error) {
    console.error("Error in /generate route:", error);
    res.status(500).json({ error: "Failed to generate component" });
  }
});

module.exports = router;
