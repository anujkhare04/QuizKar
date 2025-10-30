 const Quiz=require('../model/createquizmodel')

 module.exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






module.exports.random=async(req,res) => {

try {
  const getquiz=await Quiz.aggregate([{$sample:{size:1}}])
  if(!getquiz){
      return res.status(404).json({ message: "No quizzes found" });
  }
  res.json(getquiz[0]);
} catch (error) {
   res.status(500).json({ error: err.message });
}

}

module.exports. getByCategory = async (req, res) => {
  try {
    const { cat } = req.params;
    const quizzes = await Quiz.find({ category: cat });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports.getMixedCategories = async (req, res) => {
  try {
    
    const categories = await Quiz.distinct("category");
    
    if (!categories.length) {
      return res.status(404).json({ message: "No categories found" });
    }

   
    const mixedQuizzes = await Promise.all(
      categories.map(async (cat) => {
        const quiz = await Quiz.aggregate([
          { $match: { category: cat } },
          { $sample: { size: 1 } }
        ]);
        return quiz[0]; 
      })
    );

    res.json(mixedQuizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports.getcategory = async (req, res) => {
  try {
    // get all distinct categories from quizzes
    const categories = await Quiz.distinct("category");

    if (!categories.length) {
      return res.status(404).json({ message: "No categories found" });
    }

    res.json(categories); // send array of category names
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: err.message });
  }
};