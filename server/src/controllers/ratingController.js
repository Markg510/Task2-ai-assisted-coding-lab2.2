import { Rating } from "../models/Rating.js";

export const createRating = async (req, res, next) => {
  try {
    const rating = await Rating.create(req.body);

    res.status(201).json({ rating });
  } catch (err) {
    next(err);
  }
};

export const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find();

    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
};

export const getRating = async (req, res, next) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({
        message: "Rating not found",
      });
    }

    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
};

export const getRatingSummary = async (req, res, next) => {
  try {
    const { movieCode } = req.query;

    if (!movieCode) {
      return res.status(400).json({
        message: "movieCode is required",
      });
    }

    const result = await Rating.aggregate([
      {
        $match: {
          movieCode,
        },
      },
      {
        $group: {
          _id: "$movieCode",
          averageRating: {
            $avg: "$rating",
          },
          ratingCount: {
            $sum: 1,
          },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        movieCode,
        averageRating: 0,
        ratingCount: 0,
      });
    }

    res.status(200).json({
      movieCode,
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount,
    });
  } catch (err) {
    next(err);
  }
};