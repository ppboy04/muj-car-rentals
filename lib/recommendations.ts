export interface CarRecommendation {
  car_id: string;
  score: number;
  reason: string;
}

export interface RecommendResponse {
  recommendations: CarRecommendation[];
  strategy: string;
}

export interface RecommendRequest {
  user_id: string;
  car_id?: string;
  top_n?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000';

export async function getRecommendations(
  request: RecommendRequest
): Promise<RecommendResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: request.user_id,
        car_id: request.car_id || null,
        top_n: request.top_n || 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { recommendations: [], strategy: 'error' };
  }
}

export async function getSimilarCars(carId: string, topN: number = 5): Promise<CarRecommendation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend/similar/${carId}?top_n=${topN}`);
    if (!response.ok) throw new Error('Failed to fetch similar cars');
    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error('Error fetching similar cars:', error);
    return [];
  }
}
